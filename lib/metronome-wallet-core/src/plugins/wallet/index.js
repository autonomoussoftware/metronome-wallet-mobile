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

const createPrivateKey = (seed, index) =>
  getWalletFromSeed(seed, index)
    .getPrivateKeyString()

const getAddressAndPrivateKey = (seed, index) => ({
  address: createAddress(seed, index),
  privateKey: createPrivateKey(seed, index)
})

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
  return web3.eth.getTransactionCount(from, 'pending')
    .then(nonce =>
      web3.eth.sendTransaction({ from, to, value, gas, gasPrice, nonce })
    )
}

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  web3 = new Web3(new Web3.providers.WebsocketProvider(
    config.eth.wsApiUrl,
    { autoReconnect: true, timeout: 30000 }
  ))

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
      createPrivateKey,
      getAddressAndPrivateKey,
      getGasLimit,
      getGasPrice,
      sendEth: (...args) => plugins.explorer.logTransaction(sendEth)(...args),
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
