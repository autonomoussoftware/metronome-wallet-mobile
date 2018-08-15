'use strict'

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

function openAccount (address) {
  return Promise.resolve()
}

let web3

function start ({ config, eventsBus }) {
  web3 = web3 || new Web3(config.eth.wsApiUrl)

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

  return {
    createAddress,
    name: 'wallet',
    openAccount,
    web3Provider: web3.currentProvider
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
