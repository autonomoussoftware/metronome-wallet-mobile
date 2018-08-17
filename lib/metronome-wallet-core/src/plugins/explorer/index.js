'use strict'

const Web3 = require('web3')

const createStream = require('./blocks-stream')

let blocksStream

function start ({ eventsBus, plugins }) {
  if (!blocksStream) {
    blocksStream = createStream(new Web3(plugins.wallet.web3Provider))

    blocksStream.on('data', function (header) {
      console.log('Block', header.number) // eslint-disable-line
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
