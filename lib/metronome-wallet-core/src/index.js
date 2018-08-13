'use strict'

const EventEmitter = require('events')

const coincap = require('./plugins/coincap')

function start ({ config }) {
  const eventsBus = new EventEmitter()

  coincap.start({ config, eventsBus })

  return { emitter: eventsBus }
}

module.exports = {
  start
}
