'use strict'

const createStream = require('./coincap-stream')

function start ({ eventsBus }) {
  const dataStream = createStream('ETH', 'ETH_USD')

  dataStream.on('data', function (price) {
    eventsBus.emit(
      'eth-price-updated',
      { token: 'ETH', currency: 'USD', price }
    )
  })
}

module.exports = {
  start
}
