// see https://github.com/facebook/react-native/issues/14796
global.Buffer = require('buffer').Buffer

global.process = require('process')
global.crypto = require('crypto')

// see https://github.com/facebook/react-native/issues/16434
global.URL = require('whatwg-url').URL

// Fixes isomorphic-fetch
global.self = global.self || global

global.btoa = require('base-64').encode
