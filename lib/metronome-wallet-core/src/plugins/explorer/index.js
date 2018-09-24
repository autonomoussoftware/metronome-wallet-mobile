'use strict'

const { debounce, groupBy, merge, reduce } = require('lodash')
const debug = require('debug')('met-wallet:core:explorer')
const pDefer = require('p-defer')
const promiseAllProps = require('promise-all-props')
const Web3 = require('web3')

const createStream = require('./blocks-stream')
const indexer = require('./indexer')

function markFailedTransaction ({ transaction, receipt, meta }) {
  if (receipt && meta) {
    meta.contractCallFailed = receipt.status === false
  }

  return { transaction, receipt, meta }
}

let blocksStream
let bestBlock

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  const web3 = new Web3(plugins.eth.web3Provider)

  function getAndEmitBlock () {
    debug('Getting latest block')
    return web3.eth.getBlock('latest')
      .then(function (block) {
        debug('Latest block', block.number, block.hash)
        bestBlock = block.number
        eventBus.emit('eth-block', block)
      })
      .catch(function (err) {
        debug('Could not get lastest block')
        eventBus.emit('wallet-error', {
          inner: err,
          message: 'Could not get lastest block',
          meta: { plugin: 'explorer' }
        })
      })
  }

  const started = getAndEmitBlock()

  blocksStream = createStream(web3)

  let timeoutId

  blocksStream.on('data', function (header) {
    clearTimeout(timeoutId)

    debug('New block', header.number, header.hash)
    bestBlock = header.number
    eventBus.emit('eth-block', header)

    timeoutId = setTimeout(function () {
      debug('No blocks received. Probing connection...')
      getAndEmitBlock()
    }, 60000)
  })

  blocksStream.on('error', function (err) {
    eventBus.emit('wallet-error', {
      inner: err,
      message: 'Block headers subscription failed',
      meta: { plugin: 'explorer' }
    })
  })

  eventBus.on('open-wallets', function () {
    // TODO sync transactions
    // TODO listen for new transactions
  })

  let pendingEvents = []

  const metasCache = {}

  function mergeEvents (hash, events) {
    const metas = events.map(({ event, metaParser }) => metaParser(event))

    metas.unshift(metasCache[hash] || {})

    metasCache[hash] = reduce(metas, merge)

    return metasCache[hash]
  }

  function emitTransactions (address, transactions) {
    eventBus.emit('wallet-state-changed', {
      // walletId is temporarily hardcoded
      1: {
        addresses: {
          [address]: {
            transactions: transactions.map(markFailedTransaction)
          }
        }
      }
    })
    eventBus.emit('eth-tx')
  }

  function emitPendingEvents (address) {
    const grouped = (groupBy(
      pendingEvents.filter(e => e.address === address),
      'event.transactionHash')
    )

    Promise.all(Object.keys(grouped).map(hash => promiseAllProps({
      transaction: web3.eth.getTransaction(hash),
      receipt: web3.eth.getTransactionReceipt(hash),
      meta: mergeEvents(hash, grouped[hash])
    })))
      .then(function (transactions) {
        emitTransactions(address, transactions)
      })
      .catch(function (err) {
        eventBus.emit('wallet-error', {
          inner: err,
          message: 'Could not emit event transaction',
          meta: { plugin: 'tokens' }
        })
      })

    pendingEvents = pendingEvents.filter(e => e.address !== address)
  }

  const debouncedEmitPendingEvents = debounce(
    emitPendingEvents,
    config.explorer.debounce
  )

  const queueAndEmitEvent = (address, metaParser) => function (event) {
    debug('Queueing event', event.event)
    pendingEvents.push({ address, event, metaParser })
    debouncedEmitPendingEvents(address)
  }

  const queueAndEmitTransaction = (address, meta) => function (hash) {
    debug('Queueing transaction', hash)
    pendingEvents.push({
      address,
      event: { transactionHash: hash },
      metaParser: () => (meta || {})
    })
    debouncedEmitPendingEvents(address)
  }

  const registeredEvents = []

  function registerEvent (fn) {
    registeredEvents.push(fn)
  }

  const syncEvents = (fromBlock, toBlock, address) =>
    Promise.all(registeredEvents.map(function (fn) {
      const {
        contractAddress,
        abi,
        eventName,
        filter,
        metaParser
      } = fn(address)

      const contract = new web3.eth.Contract(abi, contractAddress)

      // Subscribe to incoming events
      contract.events[eventName]({ fromBlock, filter })
        .on('data', queueAndEmitEvent(address, metaParser))
        .on('changed', queueAndEmitEvent(address, metaParser))
        .on('error', function (err) {
          eventBus.emit('wallet-error', {
            inner: err,
            message: 'Subscription to events failed',
            meta: { plugin: 'explorer' }
          })
        })

      // Get past events
      return contract.getPastEvents(eventName, {
        fromBlock,
        toBlock,
        filter
      })
        .then(function (events) {
          debug(`${events.length} past ${eventName} events retrieved`)
          events.forEach(queueAndEmitEvent(address, metaParser))
        })
    }))

  function syncEthTransactions (fromBlock, toBlock, address) {
    // Subscribe to incoming transactions
    indexer(config.explorer).getTransactionStream(address)
      .on('data', queueAndEmitTransaction(address))
      .on('error', function (err) {
        eventBus.emit('wallet-error', {
          inner: err,
          message: 'Failed to sync transactions',
          meta: { plugin: 'explorer' }
        })
      })

    // Get past transactions
    return indexer(config.explorer).getTransactions(fromBlock, toBlock, address)
      .then(function (transactions) {
        debug(`${transactions.length} past ETH transactions retrieved`)
        transactions.forEach(queueAndEmitTransaction(address))
      })
  }

  const syncTransactions = (fromBlock, address) => started
    .then(function () {
      debug('Syncing', fromBlock, bestBlock)
      return Promise.all([
        bestBlock,
        syncEthTransactions(fromBlock, bestBlock, address),
        syncEvents(fromBlock, bestBlock, address)
      ])
    })
    .then(([best]) => best)

  function logTransaction (promiEvent, from, meta) {
    // PromiEvent objects shall be wrapped to avoid the promise chain to
    // cast it to a plain promise
    if (promiEvent.once) {
      const deferred = pDefer()

      promiEvent.once('transactionHash', function (hash) {
        queueAndEmitTransaction(from, meta)(hash)
      })
      promiEvent.once('receipt', function (receipt) {
        queueAndEmitTransaction(from)(receipt.transactionHash)
        eventBus.emit('eth-tx')
        deferred.resolve({ receipt })
      })
      promiEvent.once('error', function (err) {
        promiEvent.removeAllListeners()
        deferred.reject(err)
      })

      return deferred.promise
    }

    // This is not a wrapped PromiEvent object. It shall be a plain promise
    // instead.
    const promise = promiEvent
    return promise.then(function (receipt) {
      queueAndEmitTransaction(from)(receipt.transactionHash)
      eventBus.emit('eth-tx')
      return { receipt }
    })
  }

  return {
    api: {
      emitTransactions,
      logTransaction,
      registerEvent,
      syncTransactions
    },
    events: [
      'eth-block',
      'wallet-error'
    ],
    name: 'explorer'
  }
}

function stop () {
  blocksStream.destroy()
}

module.exports = {
  start,
  stop
}
