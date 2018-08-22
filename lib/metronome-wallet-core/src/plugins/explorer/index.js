'use strict'

const debug = require('debug')('met-wallet:core:explorer')
const Web3 = require('web3')

const createStream = require('./blocks-stream')

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
    // TODO rescan unconfirmed (period?)
    // TODO sync transactions
    // TODO listen for new transactions
  })

  return {
    events: [
      'eth-block',
      'wallet-error'
    ]
  }
}

function stop () {
  blocksStream.destroy()
}

module.exports = {
  start,
  stop
}
