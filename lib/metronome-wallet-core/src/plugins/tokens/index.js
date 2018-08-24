'use strict'

const { isAddress, toChecksumAddress } = require('web3-utils')
const debug = require('debug')('met-wallet:core:tokens')
const Web3 = require('web3')

const abi = require('./erc20-abi.json')
const getEventDataCreators = require('./events')

const tokens = []

function registerToken (plugins, contractAddress, meta) {
  debug('Registering token', contractAddress, meta)

  if (!isAddress(contractAddress)) {
    return false
  }

  const checksumAddress = toChecksumAddress(contractAddress)

  if (tokens.find(t => t.address === checksumAddress)) {
    return false
  }

  tokens.push({ contractAddress: checksumAddress, meta })

  getEventDataCreators(checksumAddress).forEach(plugins.explorer.registerEvent)

  return true
}

function getTokenBalance (web3, contractAddress, address) {
  const contract = new web3.eth.Contract(abi, contractAddress)
  return contract.methods.balanceOf(address).call()
}

function getTokensGasLimit (web3, { token: contractAddress, to, from, value }) {
  const contract = new web3.eth.Contract(abi, contractAddress)
  return contract.methods.transfer(to, value).estimateGas({ from })
    .then(gasLimit => ({ gasLimit }))
}

let accountAddress

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  const web3 = new Web3(plugins.wallet.web3Provider)

  function emitBalances (address) {
    tokens.forEach(function ({ contractAddress, meta: { symbol } }) {
      getTokenBalance(web3, contractAddress, address)
        .then(function (balance) {
          eventBus.emit('wallet-state-changed', {
            // walletId is temporarily hardcoded
            1: {
              addresses: {
                [address]: {
                  token: {
                    [contractAddress]: {
                      symbol,
                      balance
                    }
                  }
                }
              }
            }
          })
        })
        .catch(function (err) {
          eventBus.emit('wallet-error', {
            inner: err,
            message: `Could not get ${symbol} token balance`,
            meta: { plugin: 'wallet' }
          })
        })
    })
  }

  eventBus.on('open-wallets', function ({ address }) {
    accountAddress = address

    emitBalances(address)
  })

  eventBus.on('eth-tx', function () {
    if (accountAddress) {
      emitBalances(accountAddress)
    }
  })

  return {
    api: {
      getTokensGasLimit: (...args) => getTokensGasLimit(web3, ...args),
      registerToken: (...args) => registerToken(plugins, ...args)
    },
    name: 'tokens'
  }
}

function stop () {
  accountAddress = null
}

module.exports = {
  start,
  stop
}