'use strict'

const coincap = require('coincap-lib')
const EventEmitter = require('events')

const noop = () => undefined

function createDataStream (coin, marketId) {
  const stream = new EventEmitter()

  coincap.on('trades', function (trade) {
    if (trade.coin !== coin || trade.market_id !== marketId) {
      return
    }
    if (typeof trade.msg.price !== 'number') {
      return
    }

    stream.emit('data', trade.msg.price)
  })
  coincap.open()

  coincap.coin(coin)
    .then(function ({ price }) {
      if (typeof price !== 'number') {
        return
      }

      stream.emit('data', price)
    })
    .catch(noop)

  stream.destroy = function () {
    coincap.off('trades')
    coincap.close()
  }

  return stream
}

module.exports = createDataStream
