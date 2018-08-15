'use strict'

function createStream (web3) {
  const subscription = web3.eth.subscribe('newBlockHeaders')
  subscription.destroy = subscription.unsubscribe
  return subscription
}

module.exports = createStream
