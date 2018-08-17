'use strict'

const createStream = require('./coincap-stream')
const throttle = require('lodash/throttle')

let dataStream

function start ({ config, eventsBus }) {
  function emitPrice (price) {
    const priceData = { token: 'ETH', currency: 'USD', price }
    eventsBus.emit('eth-price-updated', priceData)
  }

  if (!dataStream) {
    dataStream = createStream('ETH', 'ETH_USD')

    dataStream.on('data', throttle(
      emitPrice,
      config.rates.updateMs,
      { leading: true, trailing: false }
    ))
  }

  return {
    events: [
      'eth-price-updated'
    ]
  }
}

function stop () {
  if (dataStream) {
    dataStream.destroy()
    dataStream = null
  }
}

module.exports = {
  start,
  stop
}
