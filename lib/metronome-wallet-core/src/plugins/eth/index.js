'use strict'

const debug = require('debug')('met-wallet:core:eth')

const { checkChainId } = require('./chain')
const { createWeb3, destroyWeb3 } = require('./web3')

let web3 = null

function start ({ config, eventBus }) {
  debug.enabled = config.debug

  web3 = createWeb3(config)

  checkChainId(web3, config.eth.chain)
    .then(match => !match && Promise.reject(new Error('Wrong chain')))
    .catch(function (err) {
      eventBus.emit('wallet-error', {
        inner: err,
        message: err.message || 'Could not get chain ID',
        meta: { plugin: 'wallet' }
      })
    })

  return {
    api: {
      web3Provider: web3.currentProvider
    },
    name: 'eth'
  }
}

function stop () {
  destroyWeb3(web3)
  web3 = null
}

module.exports = {
  start,
  stop
}
