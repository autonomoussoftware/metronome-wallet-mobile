'use strict'

const createStream = require('./coincap-stream')
const throttle = require('lodash/throttle')

let dataStream

function start ({ config, eventsBus }) {
  if (dataStream) {
    return
  }

  function emitPrice (price) {
    const priceData = { token: 'ETH', currency: 'USD', price }
    eventsBus.emit('eth-price-updated', priceData)
  }

  dataStream = createStream('ETH', 'ETH_USD')

  dataStream.on('data', throttle(
    emitPrice,
    config.rates.updateMs,
    { leading: true, trailing: false }
  ))
}

function stop () {
  if (!dataStream) {
    return
  }

  dataStream.destroy()
  dataStream = null
}

module.exports = {
  start,
  stop
}
