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

let statusStream

function createStatusStream (web3, chain, eventsBus) {
  const getMetronomeStatus = function () {
    return Promise.all([
      getAuctionStatus(web3, chain)
        .then(function (status) {
          eventsBus.emit('auction-status-updated', status)
        }),
      getConverterStatus(web3, chain)
        .then(function (status) {
          eventsBus.emit('mtn-converter-status-updated', status)
        })
    ])
  }

  return {
    start () {
      getMetronomeStatus()
        .then(function () {
          eventsBus.on('eth-block', getMetronomeStatus)
        })
        .catch(function (err) {
          eventsBus.emit('wallet-error', {
            inner: err,
            message: 'Metronome status could not be retrieved',
            meta: { plugin: 'metronome' }
          })
        })
    },
    stop () {
      eventsBus.removeListener('eth-block', getMetronomeStatus)
    }
  }
}

function start ({ config, eventsBus, plugins }) {
  const { chain } = config.eth

  const web3 = new Web3(plugins.wallet.web3Provider)

  if (!statusStream) {
    statusStream = createStatusStream(web3, chain, eventsBus).start()
  }

  plugins.tokens.registerToken(MetronomeContracts.addresses[chain].metToken, {
    decimals: 18,
    name: 'Metronome',
    symbol: 'MET'
  })

  return {
    api: {
      buyMetronome: (...params) => buyMet(web3, chain, ...params)
        .then(function (receipt) {
          eventsBus.emit('eth-tx', receipt)
          return receipt
        }),
      convertEth: (...params) => convertEth(web3, chain, ...params)
        .then(function (receipt) {
          eventsBus.emit('eth-tx', receipt)
          return receipt
        }),
      convertMet: (...params) => convertMet(web3, chain, ...params)
        .then(function (receipt) {
          eventsBus.emit('eth-tx', receipt)
          return receipt
        }),
      getAuctionGasLimit: params => estimateAuctionGas(web3, chain, params),
      getConvertEthEstimate: params => getEthToMetEstimate(web3, chain, params),
      getConvertEthGasLimit: params => estimateEthToMetGas(web3, chain, params),
      getConvertMetEstimate: params => getMetToMetEstimate(web3, chain, params),
      getConvertMetGasLimit: params => estimateMetToEthGas(web3, chain, params),
      sendMet: (...params) => sendMet(web3, chain, ...params)
        .then(function (receipt) {
          eventsBus.emit('eth-tx', receipt)
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

function stop () {
  if (statusStream) {
    statusStream.stop()
    statusStream = null
  }
}

module.exports = {
  start,
  stop
}
