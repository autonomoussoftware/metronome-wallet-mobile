'use strict'

const EventEmitter = require('events')
const debug = require('debug')('met-wallet:core')

const defaultConfig = require('./defaultConfig')

const plugins = [
  require('./plugins/coincap'),
  require('./plugins/eth'),
  require('./plugins/explorer'),
  require('./plugins/wallet'),
  require('./plugins/tokens'),
  require('./plugins/metronome')
]

let eventBus
let initialized = false

function start ({ config: givenConfig }) {
  const config = Object.assign(defaultConfig, givenConfig)

  debug.enabled = config.debug

  if (initialized) {
    throw new Error('Wallet Core already initialized')
  }

  debug('Starting', config)

  eventBus = new EventEmitter()

  if (debug.enabled) {
    const emit = eventBus.emit.bind(eventBus)
    eventBus.emit = function (eventName, ...args) {
      debug('<<--', eventName, ...args)
      emit(eventName, ...args)
    }
  }

  const coreApi = {}
  const coreEvents = []

  plugins.forEach(function (plugin) {
    const params = { config, eventBus, plugins: coreApi }
    const { api, events, name } = plugin.start(params)

    if (api && name) {
      Object.assign(coreApi, { [name]: api })
    }

    if (events) {
      events.forEach(function (event) {
        if (!coreEvents.includes(event)) {
          coreEvents.push(event)
        }
      })
    }
  })

  debug('Exposed events', coreEvents)

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

  debug('Stopped')
}

module.exports = {
  start,
  stop
}
