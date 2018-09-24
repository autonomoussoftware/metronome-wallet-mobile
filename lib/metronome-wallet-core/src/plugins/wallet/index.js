'use strict'

const debug = require('debug')('met-wallet:core:wallet')
const Web3 = require('web3')

const api = require('./api')
const hdkey = require('./hdkey')

let addresses = []

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  const web3 = new Web3(plugins.eth.web3Provider)

  function emitBalance (address) {
    web3.eth.getBalance(address)
      .then(function (balance) {
        eventBus.emit('wallet-state-changed', {
          // walletId is temporarily hardcoded
          1: {
            addresses: {
              [address]: {
                balance
              }
            }
          }
        })
      })
      .catch(function (err) {
        eventBus.emit('wallet-error', {
          inner: err,
          message: 'Could not get ETH balance',
          meta: { plugin: 'wallet' }
        })
      })
  }

  eventBus.on('open-wallets', function ({ address }) {
    addresses.push(address)
    emitBalance(address)
  })

  eventBus.on('eth-tx', function () {
    addresses.forEach(function (address) {
      emitBalance(address)
    })
  })

  return {
    api: {
      createAddress: hdkey.getAddress,
      createPrivateKey: hdkey.getPrivateKey,
      getAddressAndPrivateKey: hdkey.getAddressAndPrivateKey,
      getGasLimit: api.estimateGas(web3),
      getGasPrice: api.getGasPrice(web3),
      sendEth: api.sendSignedTransaction(web3, plugins.explorer.logTransaction)
    },
    events: [
      'wallet-error',
      'wallet-state-changed'
    ],
    name: 'wallet'
  }
}

function stop () {
  addresses = []
}

module.exports = {
  start,
  stop
}
