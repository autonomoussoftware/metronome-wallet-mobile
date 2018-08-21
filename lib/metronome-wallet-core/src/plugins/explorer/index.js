'use strict'

const debug = require('debug')('met-wallet:core:explorer')
const Web3 = require('web3')

const createStream = require('./blocks-stream')

let blocksStream

function start ({ config, eventsBus, plugins }) {
  debug.enabled = config.debug

  const web3 = new Web3(plugins.wallet.web3Provider)

  if (!blocksStream) {
    blocksStream = createStream(web3)

    blocksStream.on('data', function (header) {
      debug('New block', header.number, header.hash)
      eventsBus.emit('eth-block', header)
    })

    blocksStream.on('error', function (err) {
      eventsBus.emit('wallet-error', {
        inner: err,
        message: 'Block headers subscription failed',
        meta: { plugin: 'explorer' }
      })
    })
  }

  web3.eth.getBlock('latest')
    .then(function (block) {
      debug('Latest block', block.number, block.hash)
      eventsBus.emit('eth-block', block)
    })
    .catch(function (err) {
      eventsBus.emit('wallet-error', {
        inner: err,
        message: 'Could not get lastest block',
        meta: { plugin: 'explorer' }
      })
    })

  // TODO
  // on wallet open
  // rescan unconfirmed (on period)
  // send transactions?
  // sync transactions

  return {
    events: [
      'eth-block',
      'wallet-error'
    ]
  }
}

function stop () {
  if (blocksStream) {
    blocksStream.destroy()
  }
}

module.exports = {
  start,
  stop
}
