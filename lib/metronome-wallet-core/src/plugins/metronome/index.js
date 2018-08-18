'use strict'

const MetronomeContracts = require('metronome-contracts')
const Web3 = require('web3')

const getAuctionStatus = require('./auction-status')
const getConverterStatus = require('./converter-status')

let metronomeStatusStream

function createMetronomeStatusStream (chain, eventsBus, web3Provider) {
  const web3 = new Web3(web3Provider)

  const getMetronomeStatus = function () {
    return Promise.all([
      getAuctionStatus({ web3, chain })
        .then(function (status) {
          eventsBus.emit('auction-status-updated', status)
        }),
      getConverterStatus({ web3, chain })
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

  if (!metronomeStatusStream) {
    metronomeStatusStream = createMetronomeStatusStream(
      chain,
      eventsBus,
      plugins.wallet.web3Provider
    ).start()
  }

  plugins.tokens.registerToken(MetronomeContracts.addresses[chain].metToken, {
    decimals: 18,
    name: 'Metronome',
    symbol: 'MET'
  })

  return {
    events: [
      'auction-status-updated',
      'mtn-converter-status-updated',
      'wallet-error'
    ]
  }
}

function stop () {
  if (metronomeStatusStream) {
    metronomeStatusStream.stop()
    metronomeStatusStream = null
  }
}

module.exports = {
  start,
  stop
}
