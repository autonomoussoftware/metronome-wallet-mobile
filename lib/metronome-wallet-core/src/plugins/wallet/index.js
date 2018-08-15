'use strict'

const hdkey = require('ethereumjs-wallet/hdkey')

function createAddress (seed) {
  return hdkey
    .fromMasterSeed(Buffer.from(seed, 'hex'))
    .derivePath("m/44'/60'/0'/0/0")
    .getWallet()
    .getChecksumAddressString()
    .toLowerCase()
}

function openAccount (address) {
  return Promise.resolve()
}

function start () {
  return {
    createAddress,
    openAccount
  }
}

function stop () {}

module.exports = {
  start,
  stop
}
