'use strict'

const debug = require('debug')('met-wallet:core:metronome')
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
const getAuctionEventDataCreator = require('./auction-events')
const getConverterEventDataCreator = require('./converter-events')

function start ({ config, eventBus, plugins }) {
  debug.enabled = config.debug

  const { chain } = config.eth

  plugins.tokens.registerToken(MetronomeContracts.addresses[chain].metToken, {
    decimals: 18,
    name: 'Metronome',
    symbol: 'MET'
  })

  getConverterEventDataCreator(chain)
    .concat(getAuctionEventDataCreator(chain))
    .forEach(plugins.explorer.registerEvent)

  const web3 = new Web3(plugins.wallet.web3Provider)

  const emitMetronomeStatus = () =>
    Promise.all([
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

  return {
    api: {
      buyMetronome: (...args) =>
        plugins.explorer.logTransaction(buyMet)(web3, chain, ...args),
      convertEth: (...args) =>
        plugins.explorer.logTransaction(convertEth)(web3, chain, ...args),
      convertMet: (...args) =>
        plugins.explorer.logTransaction(convertMet)(web3, chain, ...args),
      getAuctionGasLimit: args =>
        estimateAuctionGas(web3, chain, args),
      getConvertEthEstimate: args =>
        getEthToMetEstimate(web3, chain, args),
      getConvertEthGasLimit: args =>
        estimateEthToMetGas(web3, chain, args),
      getConvertMetEstimate: args =>
        getMetToMetEstimate(web3, chain, args),
      getConvertMetGasLimit: args =>
        estimateMetToEthGas(web3, chain, args),
      sendMet: (...args) =>
        plugins.explorer.logTransaction(sendMet)(web3, chain, ...args)
    },
    events: [
      'auction-status-updated',
      'mtn-converter-status-updated',
      'wallet-error'
    ],
    name: 'metronome'
  }
}

function stop () { }

module.exports = {
  start,
  stop
}
