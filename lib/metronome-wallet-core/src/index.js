'use strict'

const EventEmitter = require('events')

const coincap = require('./plugins/coincap')
const explorer = require('./plugins/explorer')
const metronome = require('./plugins/metronome')
const wallet = require('./plugins/wallet')

function start ({ config }) {
  console.log('Starting core with config', config) // eslint-disable-line

  const eventsBus = new EventEmitter()

  const plugins = [
    coincap,
    wallet,
    explorer,
    metronome
  ]

  const coreApi = {}
  const coreEvents = []

  plugins.forEach(function (plugin) {
    const { api, events, name } = plugin.start({
      config,
      eventsBus,
      plugins: coreApi
    })
    Object.assign(coreApi, { [name]: api })
    events.forEach(function (event) {
      if (!coreEvents.includes(event)) {
        coreEvents.push(event)
      }
    })
  })

  return Object.assign({
    emitter: eventsBus,
    events: coreEvents
  }, coreApi)
}

module.exports = {
  start
}
