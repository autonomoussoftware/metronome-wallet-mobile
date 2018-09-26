'use strict'

const debug = require('debug')('met-wallet:core:eth:web3')
const Web3 = require('web3')

function createWeb3 (config) {
  debug.enabled = config.debug

  const web3 = new Web3(new Web3.providers.WebsocketProvider(
    config.eth.wsApiUrl,
    { autoReconnect: true, timeout: 30000 }
  ))

  web3.currentProvider.on('connect', function () {
    debug('Web3 provider connected')
  })
  web3.currentProvider.on('error', function (err) {
    debug('Web3 provider connection error', err)
  })
  web3.currentProvider.on('end', function (code) {
    debug('Web3 provider connection ended', code)
  })

  return web3
}

function destroyWeb3 (web3) {
  web3.currentProvider.disconnect()
}

module.exports = {
  createWeb3,
  destroyWeb3
}
