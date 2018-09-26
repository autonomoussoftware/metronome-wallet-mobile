'use strict'

const axios = require('axios')
const EventEmitter = require('events')
const io = require('socket.io-client')

const getSocket = baseURL =>
  Promise.resolve(io(`${baseURL}/v1`, { autoConnect: false }))

function createIndexer ({ indexerUrl }) {
  const getTransactions = (fromBlock, toBlock, address) => axios({
    baseURL: indexerUrl,
    url: `/addresses/${address}/transactions`,
    params: { from: fromBlock, to: toBlock }
  })
    .then(res => res.data)

  function getTransactionStream (address) {
    const stream = new EventEmitter()

    getSocket(indexerUrl)
      .then(function (socket) {
        socket.on('connect', function () {
          socket.emit(
            'subscribe',
            { type: 'txs', addresses: [address] },
            function (err) {
              if (err) {
                stream.emit('error', err)
              }
            }
          )
        })

        socket.on('disconnect', function (reason) {
          stream.emit('error', new Error(`Indexer disconnected with ${reason}`))
        })

        socket.on('reconnect', function () {
          stream.emit('resync')
        })

        socket.on('error', function (err) {
          stream.emit('error', err)
        })

        socket.on('tx', function ({ type, txid }) {
          if (type === 'eth') {
            stream.emit('data', txid)
          }
        })

        socket.open()
      })
      .catch(function (err) {
        stream.emit('error', err)
      })

    return stream
  }

  return {
    getTransactions,
    getTransactionStream
  }
}

module.exports = createIndexer
