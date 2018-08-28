'use strict'

const { debounce, groupBy, merge, reduce } = require('lodash')
const debug = require('debug')('met-wallet:core:explorer')
const pDefer = require('p-defer')
const promiseAllProps = require('promise-all-props')
const Web3 = require('web3')

const createStream = require('./blocks-stream')

function markFailedTransaction ({ transaction, receipt, meta }) {
  if (receipt && meta) {
    meta.contractCallFailed = receipt.status === false
  }

  return { transaction, receipt, meta }
}

let blocksStream

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  const web3 = new Web3(plugins.wallet.web3Provider)

  web3.eth.getBlock('latest')
    .then(function (block) {
      debug('Latest block', block.number, block.hash)
      eventBus.emit('eth-block', block)
    })
    .catch(function (err) {
      eventBus.emit('wallet-error', {
        inner: err,
        message: 'Could not get lastest block',
        meta: { plugin: 'explorer' }
      })
    })

  blocksStream = createStream(web3)

  blocksStream.on('data', function (header) {
    debug('New block', header.number, header.hash)
    eventBus.emit('eth-block', header)
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

  function mergeEvents (events) {
    return reduce(events.map(function ({ event, metaParser }) {
      return metaParser(event)
    }), merge)
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
        meta: mergeEvents(grouped[hash])
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
    pendingEvents.push({ address, event, metaParser })
    debouncedEmitPendingEvents(address)
  }

  const queueAndEmitTransaction = address => function (hash) {
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

  function syncTransactions (fromBlock, toBlock, address) {
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
          debug(`${events.length} ${eventName} past events retrieved`)
          events.forEach(queueAndEmitEvent(address, metaParser))
        })
    }))
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
