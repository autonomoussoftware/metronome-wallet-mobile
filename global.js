// see https://github.com/facebook/react-native/issues/14796
global.Buffer = require('buffer').Buffer

global.process = require('process')
global.crypto = require('crypto')

// Fixes web3.js websocket connection
global.URL = require('url').parse
global.btoa = require('base-64').encode

// Fixes isomorphic-fetch
global.self = global.self || global
