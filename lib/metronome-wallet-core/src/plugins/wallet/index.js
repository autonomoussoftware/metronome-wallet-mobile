'use strict'

const debug = require('debug')('met-wallet:core:wallet')
const hdkey = require('ethereumjs-wallet/hdkey')
const Web3 = require('web3')

const { ethChainIdToName } = require('./utils')

const getWalletFromSeed = (seed, index = 0) =>
  hdkey.fromMasterSeed(Buffer.from(seed, 'hex'))
    .derivePath(`m/44'/60'/0'/0/${index}`)
    .getWallet()

const createAddress = (seed, index) =>
  getWalletFromSeed(seed, index)
    .getChecksumAddressString()

function getAddressAndPrivateKey (seed, index) {
  const wallet = getWalletFromSeed(seed, index)
  return {
    address: wallet.getChecksumAddressString(),
    privateKey: wallet.getPrivateKeyString()
  }
}

let accountAddress
let web3

const getChainName = () => web3.eth.net.getId().then(ethChainIdToName)

const getGasLimit = ({ from, to, value }) =>
  web3.eth.estimateGas({ from, to, value })
    .then(gasLimit => ({ gasLimit }))

const getGasPrice = () =>
  web3.eth.getGasPrice()
    .then(gasPrice => ({ gasPrice }))

function sendEth (privateKey, { gasPrice, gas, value, from, to }) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)
  return web3.eth.sendTransaction({ from, to, value, gas, gasPrice })
}

function start ({ config, eventBus }) {
  debug.enabled = config.debug

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

  getChainName()
    .then(chain =>
      chain !== config.eth.chain && Promise.reject(new Error('Wrong chain'))
    )
    .catch(function (err) {
      eventBus.emit('wallet-error', {
        inner: err,
        message: err.message || 'Could not get chain ID',
        meta: { plugin: 'wallet' }
      })
    })

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
    accountAddress = address
    emitBalance(address)
  })

  eventBus.on('eth-tx', function () {
    if (accountAddress) {
      emitBalance(accountAddress)
    }
  })

  return {
    api: {
      createAddress,
      getAddressAndPrivateKey,
      getGasLimit,
      getGasPrice,
      sendEth: (...params) => sendEth(...params)
        .then(function (receipt) {
          eventBus.emit('eth-tx', receipt)
          return receipt
        }),
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
  web3.currentProvider.connection.close()
  web3 = null

  accountAddress = null
}

module.exports = {
  start,
  stop
}
