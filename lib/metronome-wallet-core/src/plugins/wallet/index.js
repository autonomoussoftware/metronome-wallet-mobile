'use strict'

const debug = require('debug')('met-wallet:core:wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const Web3 = require('web3')

const { ethChainIdToName } = require('./utils')

function createAddress (seed, index = 0) {
  return hdkey.fromMasterSeed(Buffer.from(seed, 'hex'))
    .derivePath(`m/44'/60'/0'/0/${index}`)
    .getWallet()
    .getChecksumAddressString()
}

function getAddressAndPrivateKey (seed, index = 0) {
  const wallet = hdkey.fromMasterSeed(Buffer.from(seed, 'hex'))
    .derivePath(`m/44'/60'/0'/0/${index}`)
    .getWallet()
  return {
    address: wallet.getChecksumAddressString(),
    privateKey: wallet.getPrivateKeyString()
  }
}

let web3

function getChainName () {
  return web3.eth.net.getId()
    .then(ethChainIdToName)
}

function getGasLimit ({ from, to, value }) {
  return web3
    .eth.estimateGas({ from, to, value })
    .then(gasLimit => ({ gasLimit }))
}

function getGasPrice () {
  return web3.eth.getGasPrice()
    .then(gasPrice => ({ gasPrice }))
}

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

  getChainName()
    .then(chain =>
      chain !== config.eth.chain && Promise.reject(new Error('Wrong chain'))
    )
    .catch(function (err) {
      eventsBus.emit('wallet-error', {
        inner: err,
        message: err.message || 'Could not get chain ID',
        meta: { plugin: 'wallet' }
      })
    })

  function getBalance (address) {
    web3.eth.getBalance(address)
      .then(function (balance) {
        eventsBus.emit('wallet-state-changed', {
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
      getAddressAndPrivateKey,
      getBalance,
      getGasLimit,
      getGasPrice,
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
