'use strict'

const debug = require('debug')('met-wallet:core:tokens')

function registerToken (address, meta) {
  debug('>>> registering token', address, meta)
}

function start ({ config }) {
  debug.enabled = config.debug

  return {
    api: {
      registerToken
    },
    name: 'tokens'
  }
}

function stop () {}

module.exports = {
  start,
  stop
}
