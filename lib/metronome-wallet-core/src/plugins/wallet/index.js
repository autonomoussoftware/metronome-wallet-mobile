'use strict'

const debug = require('debug')('met-wallet:core:wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const Web3 = require('web3')

const { ethChainIdToName } = require('./utils')

function createAddress (seed) {
  return hdkey
    .fromMasterSeed(Buffer.from(seed, 'hex'))
    .derivePath("m/44'/60'/0'/0/0")
    .getWallet()
    .getChecksumAddressString()
    .toLowerCase()
}

let web3

function start ({ config, eventsBus }) {
  debug.enabled = config.debug

  if (!web3) {
    web3 = new Web3(config.eth.wsApiUrl)

    web3.currentProvider.connection.addEventListener('open', function () {
      debug('Web3 provider connection open')
    })
    web3.currentProvider.connection.addEventListener('error', function (err) {
      debug('Web3 provider connection error', err)
    })
    web3.currentProvider.connection.addEventListener('close', function (code) {
      debug('Web3 provider connection closed', code)
    })
  }

  web3.eth.net.getId()
    .then(ethChainIdToName)
    .then(chain => chain === config.eth.chain)
    .then(correct => !correct && Promise.reject(new Error('Wrong chain')))
    .catch(function (err) {
      eventsBus.emit('wallet-error', {
        inner: err,
        message: err.message || 'Could not get chain ID',
        meta: { plugin: 'wallet' }
      })
    })

  function openAccount (address) {
    web3.eth.getBalance(address)
      .then(function (balance) {
        eventsBus.emit('wallet-state-changed', {
          // walletId is temporarily hardcoded to 0
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
        eventsBus.emit('wallet-error', {
          inner: err,
          message: 'Could not get ETH balance',
          meta: { plugin: 'wallet' }
        })
      })
  }

  // FIXME event name
  eventsBus.on('tx', function () {
    // TODO send balance
  })

  return {
    api: {
      createAddress,
      openAccount,
      web3Provider: web3.currentProvider
    },
    events: [
      'wallet-error',
      'wallet-state-changed'
    ],
    name: 'wallet'
  }
}

function stop () {
  if (web3) {
    web3.currentProvider.connection.close()
    web3 = null
  }
}

module.exports = {
  start,
  stop
}
