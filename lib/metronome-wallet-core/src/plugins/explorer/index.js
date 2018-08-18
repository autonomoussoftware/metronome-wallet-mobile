'use strict'

const debug = require('debug')('met-wallet:core:explorer')
const Web3 = require('web3')

const createStream = require('./blocks-stream')

let blocksStream

function start ({ config, eventsBus, plugins }) {
  debug.enabled = config.debug

  if (!blocksStream) {
    blocksStream = createStream(new Web3(plugins.wallet.web3Provider))

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
