global.Buffer = require('buffer').Buffer
global.process = require('process')
global.crypto = require('crypto')

// Fixes isomorphic-fetch
global.self = global.self || global
