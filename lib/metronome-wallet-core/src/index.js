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

  const pluginApis = plugins.reduce(function (apis, plugin) {
    const pluginApi = plugin.start({ config, eventsBus, plugins: apis })
    return Object.assign(apis, pluginApi ? { [pluginApi.name]: pluginApi } : {})
  }, {})

  return Object.assign(
    pluginApis,
    { emitter: eventsBus }
  )
}

module.exports = {
  start
}
