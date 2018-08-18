'use strict'

const EventEmitter = require('events')
const debug = require('debug')('met-wallet:core')

const coincap = require('./plugins/coincap')
const explorer = require('./plugins/explorer')
const metronome = require('./plugins/metronome')
const tokens = require('./plugins/tokens')
const wallet = require('./plugins/wallet')

const plugins = [
  coincap,
  wallet,
  explorer,
  tokens,
  metronome
]

function start ({ config }) {
  debug.enabled = config.debug

  debug('Starting core', config)

  const eventsBus = new EventEmitter()

  const coreApi = {}
  const coreEvents = []

  plugins.forEach(function (plugin) {
    const { api, events, name } = plugin.start({
      config,
      eventsBus,
      plugins: coreApi
    })
    if (api && name) {
      Object.assign(coreApi, { [name]: api })
    }
    if (events && events.length) {
      events.forEach(function (event) {
        if (!coreEvents.includes(event)) {
          coreEvents.push(event)
        }
      })
    }
  })

  return Object.assign({
    emitter: eventsBus,
    events: coreEvents
  }, coreApi)
}

function stop () {
  plugins.forEach(function (plugin) {
    plugin.stop()
  })
}

module.exports = {
  start,
  stop
}
