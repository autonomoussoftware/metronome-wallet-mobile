'use strict'

const coincap = require('coincap-lib')
const EventEmitter = require('events')

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
  coincap.on('disconnect', function (reason) {
    stream.emit('error', new Error(`Disconnected from CoinCap with ${reason}`))
  })
  coincap.on('error', function (err) {
    stream.emit('error', err)
  })
  coincap.open()

  coincap.coin(coin)
    .then(function ({ price }) {
      if (typeof price !== 'number') {
        return
      }

      stream.emit('data', price)
    })
    .catch(function (err) {
      stream.emit('error', err)
    })

  stream.destroy = function () {
    coincap.off('trades')
    coincap.close()
  }

  return stream
}

module.exports = createDataStream
