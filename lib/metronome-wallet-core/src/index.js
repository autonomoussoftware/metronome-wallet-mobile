'use strict'

const EventEmitter = require('events')

const coincap = require('./plugins/coincap')

function start () {
  const eventsBus = new EventEmitter()

  coincap.start({ eventsBus })

  return { emitter: eventsBus }
}

module.exports = {
  start
}
