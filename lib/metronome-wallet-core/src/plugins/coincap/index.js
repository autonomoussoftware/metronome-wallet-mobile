'use strict'

const createStream = require('./coincap-stream')
const throttle = require('lodash/throttle')

let dataStream

function start ({ config, eventBus }) {
  function emitPrice (price) {
    const priceData = { token: 'ETH', currency: 'USD', price }
    eventBus.emit('eth-price-updated', priceData)
  }

  const throttledEmitPrice = throttle(
    emitPrice,
    config.rates.updateMs,
    { leading: true, trailing: false }
  )

  dataStream = createStream('ETH', 'ETH_USD')

  dataStream.on('data', throttledEmitPrice)

  dataStream.on('error', function (err) {
    eventBus.emit('wallet-error', {
      inner: err,
      message: err.message,
      meta: { plugin: 'coincap' }
    })
  })

  return {
    events: [
      'eth-price-updated'
    ]
  }
}

function stop () {
  dataStream.destroy()
  dataStream = null
}

module.exports = {
  start,
  stop
}
