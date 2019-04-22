// see https://github.com/facebook/react-native/issues/14796
global.Buffer = require('buffer').Buffer

global.process = require('process')
global.crypto = require('crypto')

// Fixes web3.js websocket connection
// eslint-disable-next-line node/no-deprecated-api
global.URL = require('url').parse // url.parse deprecated since Node 11
global.btoa = require('base-64').encode

// Fixes isomorphic-fetch
global.self = global.self || global

// Fixes "undefined is not a function (evaluating 'BASE_MAP.fill(255)')"
// see https://github.com/cryptocoinjs/base-x/issues/56
if (!Uint8Array.prototype.fill) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'fill', {
    value(value) {
      if (this == null) {
        throw new TypeError('this is null or not defined')
      }
      const O = Object(this)
      const len = O.length >>> 0
      const start = arguments[1]
      const relativeStart = start >> 0
      let k =
        relativeStart < 0
          ? Math.max(len + relativeStart, 0)
          : Math.min(relativeStart, len)
      const end = arguments[2]
      const relativeEnd = end === undefined ? len : end >> 0
      const final =
        relativeEnd < 0
          ? Math.max(len + relativeEnd, 0)
          : Math.min(relativeEnd, len)
      while (k < final) {
        O[k] = value
        k++
      }
      return O
    }
  })
  // eslint-disable-next-line no-extend-native
  Uint8Array.prototype.fill = Array.prototype.fill
}
