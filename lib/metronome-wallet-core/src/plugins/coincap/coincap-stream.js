'use strict'

const coincap = require('coincap-lib')
const EventEmitter = require('events')

function createDataStream (coin, marketId) {
  const stream = new EventEmitter()

  coincap.on('trades', function(trade) {
    if (trade.coin !== coin || trade.market_id !== marketId) {
      return
    }
    if (typeof trade.msg.price !== 'number') {
      return
    }

    stream.emit('data', trade.msg.price)
  })

  coincap.open()

  stream.destroy = function (err) {
    coincap.off('trades')
    coincap.close()

    stream.emit('error', err)
    stream.emit('close')
  }

  return stream
}

module.exports = createDataStream
