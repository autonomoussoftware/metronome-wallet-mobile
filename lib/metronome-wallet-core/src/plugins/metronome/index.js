'use strict'

const Web3 = require('web3')

const getAuctionStatus = require('./auction-status')
const getConverterStatus = require('./converter-status')

let metronomeStatusStream

function createMetronomeStatusStream ({ config, eventsBus, plugins }) {
  const chain = config.eth.chain
  const web3 = new Web3(plugins.wallet.web3Provider)

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

function start (options) {
  if (metronomeStatusStream) {
    return
  }

  metronomeStatusStream = createMetronomeStatusStream(options).start()
}

function stop () {
  if (!metronomeStatusStream) {
    return
  }

  metronomeStatusStream.stop()
  metronomeStatusStream = null
}

module.exports = {
  start,
  stop
}
