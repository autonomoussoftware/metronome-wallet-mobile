'use strict'

const EventEmitter = require('events')

const coincap = require('./plugins/coincap')
const explorer = require('./plugins/explorer')
const metronome = require('./plugins/metronome')
const wallet = require('./plugins/wallet')

function start ({ config }) {
  const eventsBus = new EventEmitter()

  coincap.start({ config, eventsBus })
  explorer.start({ config, eventsBus })
  metronome.start({ config, eventsBus })
  const walletApi = wallet.start()

  return Object.assign(
    walletApi,
    { emitter: eventsBus }
  )
}

module.exports = {
  start
}
