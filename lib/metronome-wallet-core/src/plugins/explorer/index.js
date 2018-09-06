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

  const web3 = new Web3(plugins.wallet.web3Provider)

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

    timeoutId = setTimeout(getAndEmitBlock, 60000)
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
    const metas = events.map(function ({ event, metaParser }) {
      return metaParser(event)
    })

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

    Promise.all(Object.keys(grouped).map(function (hash) {
      return promiseAllProps({
        transaction: web3.eth.getTransaction(hash),
        receipt: web3.eth.getTransactionReceipt(hash),
        meta: mergeEvents(hash, grouped[hash])
      })
    }))
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

  const queueAndEmitTransaction = address => function (hash) {
    debug('Queueing transaction', hash)
    pendingEvents.push({
      address,
      event: { transactionHash: hash },
      metaParser: () => ({})
    })
    debouncedEmitPendingEvents(address)
  }

  const registeredEvents = []

  function registerEvent (fn) {
    registeredEvents.push(fn)
  }

  function syncEvents (fromBlock, toBlock, address) {
    return Promise.all(registeredEvents.map(function (fn) {
      const { contractAddress, abi, eventName, filter, metaParser } = fn(address)

      const contract = new web3.eth.Contract(abi, contractAddress)

      // Subscribe to incoming events
      contract.events[eventName]({ filter })
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
  }

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

  function syncTransactions (fromBlock, address) {
    return started
      .then(function () {
        debug('** Syncing', fromBlock, bestBlock)
        return Promise.all([
          bestBlock,
          syncEthTransactions(fromBlock, bestBlock, address),
          syncEvents(fromBlock, bestBlock, address)
        ])
      })
      .then(([best]) => best)
  }

  function logTransaction (fn) {
    return function (...args) {
      const { from } = args[args.length - 1]

      const deferred = pDefer()

      const emitter = fn(...args)

      if (!emitter.once) {
        // This is not a PromiEvent object. It should be a promise, result of a
        // chain of transactions queued to be processed.
        return typeof emitter.then === 'function'
          ? emitter.then(function (receipt) {
            eventBus.emit('eth-tx')
            deferred.resolve({ receipt })
          })
          : deferred.reject(new Error('Not a promise'))
      }

      emitter.once('transactionHash', function (hash) {
        queueAndEmitTransaction(from)(hash)
      })
      emitter.once('receipt', function (receipt) {
        queueAndEmitTransaction(from)(receipt.transactionHash)
        eventBus.emit('eth-tx')
        deferred.resolve({ receipt })
      })
      emitter.once('error', function (err) {
        emitter.removeAllListeners()
        deferred.reject(err)
      })

      return deferred.promise
    }
  }

  return {
    api: {
      logTransaction,
      emitTransactions,
      syncTransactions,
      registerEvent
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
