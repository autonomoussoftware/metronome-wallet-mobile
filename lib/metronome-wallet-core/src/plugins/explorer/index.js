'use strict'

const Web3 = require('web3')

const createStream = require('./blocks-stream')

let blocksStream

function start ({ eventsBus, plugins }) {
  if (blocksStream) {
    return
  }

  blocksStream = createStream(new Web3(plugins.wallet.web3Provider))

  blocksStream.on('data', function (block) {
    eventsBus.emit('eth-block', block)
  })

  blocksStream.on('error', function (err) {
    eventsBus.emit('wallet-error', {
      inner: err,
      message: 'Block headers subscription failed',
      meta: { plugin: 'explorer' }
    })
  })
}

function stop () {
  if (!blocksStream) {
    return
  }

  blocksStream.destroy()
}

module.exports = {
  start,
  stop
}
