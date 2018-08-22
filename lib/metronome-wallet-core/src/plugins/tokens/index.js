'use strict'

const { isAddress, toChecksumAddress } = require('web3-utils')
const debug = require('debug')('met-wallet:core:tokens')
const Web3 = require('web3')

const abi = require('./erc20-abi.json')

const tokens = []

function registerToken (address, meta) {
  debug('Registering token', address, meta)

  if (!isAddress(address)) {
    return false
  }

  const checksumAddress = toChecksumAddress(address)

  if (!tokens.find(t => t.address === checksumAddress)) {
    tokens.push({ contractAddress: checksumAddress, meta })
  }

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
                    [contractAddress.toLowerCase()]: {
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
      registerToken
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
