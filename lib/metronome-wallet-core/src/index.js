'use strict'

const EventEmitter = require('events')
const debug = require('debug')('met-wallet:core')

const plugins = [
  require('./plugins/coincap'),
  require('./plugins/wallet'),
  require('./plugins/explorer'),
  require('./plugins/tokens'),
  require('./plugins/metronome')
]

let eventBus
let initialized = false

function start ({ config }) {
  debug.enabled = config.debug

  if (initialized) {
    throw new Error('Wallet Core already initialized')
  }

  debug('Starting core', config)

  eventBus = new EventEmitter()

  const coreApi = {}
  const coreEvents = []

  plugins.forEach(function (plugin) {
    const params = { config, eventBus, plugins: coreApi }
    const { api, events, name } = plugin.start(params)

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

  initialized = true

  return {
    api: coreApi,
    emitter: eventBus,
    events: coreEvents
  }
}

function stop () {
  if (!initialized) {
    throw new Error('Wallet Core not initialized')
  }

  plugins.forEach(function (plugin) {
    plugin.stop()
  })

  eventBus.removeAllListeners()
  eventBus = null

  initialized = false
}

module.exports = {
  start,
  stop
}
