'use strict'

const Web3 = require('web3')

const createStream = require('./blocks-stream')

let blocksStream

function start ({ config, eventsBus }) {
  if (blocksStream) {
    return
  }

  blocksStream = createStream(new Web3(config.eth.wsApiUrl))

  blocksStream.on('data', function (block) {
    eventsBus.emit('eth-block', block)
  })

  blocksStream.on('error', function (err) {
    eventsBus.emit('connectivity-state-changed', {
      ok: false,
      reason: 'Block headers subscription failed',
      plugin: 'explorer',
      err: err.message
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
