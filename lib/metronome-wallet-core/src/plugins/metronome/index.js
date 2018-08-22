'use strict'

const MetronomeContracts = require('metronome-contracts')
const Web3 = require('web3')

const { buyMet, estimateAuctionGas } = require('./auction-api')
const {
  convertEth,
  convertMet,
  estimateEthToMetGas,
  estimateMetToEthGas,
  getEthToMetEstimate,
  getMetToMetEstimate
} = require('./converter-api')
const { sendMet } = require('./token-api')
const getAuctionStatus = require('./auction-status')
const getConverterStatus = require('./converter-status')

function start ({ config, eventBus, plugins }) {
  const { chain } = config.eth

  plugins.tokens.registerToken(MetronomeContracts.addresses[chain].metToken, {
    decimals: 18,
    name: 'Metronome',
    symbol: 'MET'
  })

  const web3 = new Web3(plugins.wallet.web3Provider)

  const emitMetronomeStatus = () => Promise.all([
    getAuctionStatus(web3, chain)
      .then(function (status) {
        eventBus.emit('auction-status-updated', status)
      }),
    getConverterStatus(web3, chain)
      .then(function (status) {
        eventBus.emit('mtn-converter-status-updated', status)
      })
  ])
    .catch(function (err) {
      eventBus.emit('wallet-error', {
        inner: err,
        message: 'Metronome status could not be retrieved',
        meta: { plugin: 'metronome' }
      })
    })

  emitMetronomeStatus()

  eventBus.on('eth-block', emitMetronomeStatus)

  eventBus.on('open-wallets', function () {
    // TODO rescan unconfirmed events (period?)
    // TODO sync events
    // TODO listen for new events
  })

  return {
    api: {
      buyMetronome: (...params) => buyMet(web3, chain, ...params)
        .then(function (receipt) {
          eventBus.emit('eth-tx', receipt)
          return receipt
        }),
      convertEth: (...params) => convertEth(web3, chain, ...params)
        .then(function (receipt) {
          eventBus.emit('eth-tx', receipt)
          return receipt
        }),
      convertMet: (...params) => convertMet(web3, chain, ...params)
        .then(function (receipt) {
          eventBus.emit('eth-tx', receipt)
          return receipt
        }),
      getAuctionGasLimit: params => estimateAuctionGas(web3, chain, params),
      getConvertEthEstimate: params => getEthToMetEstimate(web3, chain, params),
      getConvertEthGasLimit: params => estimateEthToMetGas(web3, chain, params),
      getConvertMetEstimate: params => getMetToMetEstimate(web3, chain, params),
      getConvertMetGasLimit: params => estimateMetToEthGas(web3, chain, params),
      sendMet: (...params) => sendMet(web3, chain, ...params)
        .then(function (receipt) {
          eventBus.emit('eth-tx', receipt)
          return receipt
        })
    },
    events: [
      'auction-status-updated',
      'mtn-converter-status-updated',
      'wallet-error'
    ],
    name: 'metronome'
  }
}

function stop () {}

module.exports = {
  start,
  stop
}
