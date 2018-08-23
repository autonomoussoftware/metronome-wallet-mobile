'use strict'

const { isAddress, toChecksumAddress } = require('web3-utils')
const debug = require('debug')('met-wallet:core:tokens')
const Web3 = require('web3')

const abi = require('./erc20-abi.json')
const { getPastEvents, createEventsStream } = require('./events')

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

  function parseEvent ({ address, event, returnValues }) {
    switch (event) {
      case 'Approval':
        return {
          tokens: {
            [address]: {
              event,
              from: returnValues._owner,
              to: returnValues._spender,
              value: returnValues._value,
              processing: false
            }
          }
        }
      case 'Transfer':
        return {
          tokens: {
            [address]: {
              event,
              from: returnValues._from,
              to: returnValues._to,
              value: returnValues._value,
              processing: false
            }
          }
        }
      default:
        return null
    }
  }

  const emitTransaction = address => function (event) {
    Promise.all([
      web3.eth.getTransaction(event.transactionHash),
      web3.eth.getTransactionReceipt(event.transactionHash),
      parseEvent(event)
    ])
      .then(function ([transaction, receipt, meta]) {
        eventBus.emit('wallet-state-changed', {
          // walletId is temporarily hardcoded
          1: {
            addresses: {
              [address]: {
                transactions: [{
                  transaction,
                  receipt,
                  meta
                }]
              }
            }
          }
        })
      })
      .catch(function (err) {
        eventBus.emit('wallet-error', {
          inner: err,
          message: 'Could not emit transaction',
          meta: { plugin: 'tokens' }
        })
      })
  }

  const syncTokenEvents = (fromBlock, toBlock, address) =>
    Promise.all(tokens.map(function ({ contractAddress }) {
      // Subscribe to new events
      createEventsStream(web3, contractAddress, address)
        .on('data', emitTransaction(address))
        .on('changed', emitTransaction(address))
        .on('error', function (err) {
          eventBus.emit('wallet-error', {
            inner: err,
            message: 'Subscription to token events failed',
            meta: { plugin: 'tokens' }
          })
        })

      // Get past events
      return getPastEvents(web3, contractAddress, address, fromBlock, toBlock)
        .then(function (events) {
          debug(`${events.length} past token transactions retrieved`)
          events.forEach(emitTransaction(address))
        })
    }))

  return {
    api: {
      getTokensGasLimit: (...args) => getTokensGasLimit(web3, ...args),
      registerToken,
      syncTokenEvents
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
