import core from 'metronome-wallet-core'

import * as auth from './auth'
import * as keys from './keys'
import * as utils from './utils'
import * as wallet from './wallet'

const fakeResponse = (value, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      typeof value === 'string' ? reject(new Error(value)) : resolve(value)
    }, delay)
  })
}

/**
 * Called when login/unlock form is submitted
 * Returns a Promise
 */
function onLoginSubmit({ password }) {
  return fakeResponse({ password })
}

/**
 * Called when the link "Terms & Conditions" is clicked
 * It should trigger opening the link with the platform default browser
 */
function onTermsLinkClick() {
  return fakeResponse({})
}

/**
 * Called when the link "Open in Explorer" is clicked
 * It should trigger opening the link with the platform default browser
 */
function onExplorerLinkClick() {
  return fakeResponse({})
}

/**
 * Called by "Recover wallet from mnemonic" form
 * Must return a Promise
 */
function recoverFromMnemonic({ mnemonic, password }) {
  return fakeResponse({ mnemonic, password })
}

/**
 * Called when clicking "Clear cache" button in "Settings" screen
 * Must return a Promise
 */
function clearCache() {
  return fakeResponse({})
}

/**
 * Called when prefilling the Ethereum network URL field in "Settings" screen
 * Must return a Promise
 */
function getEthereumNetworkUrl() {
  // Reference implementation in desktop wallet:
  //
  // ipcRenderer.sendSync('settings-get', {
  //   key: 'app.node.websocketApiUrl'
  // });
  return fakeResponse({ ethereumNetworkUrl: 'ws://parity.bloqrock.net:8546' })
}

/**
 * Called when updating the Ethereum network URL from "Settings" screen
 * Must return a Promise
 */
function setEthereumNetworkUrl({ ethereumNetworkUrl }) {
  // Reference implementation in desktop wallet:
  //
  // ipcRenderer.sendSync('settings-set', {
  //   key: 'app.node.websocketApiUrl',
  //   value: this.state.ethereumNetworkUrl
  // });
  return fakeResponse({})
}

/**
 * Called when the gas editor is mounted
 * Returns a Promise that resolves to an object { gasPrice: String }
 * Gas price is returned in wei
 */
function getGasPrice() {
  return fakeResponse({ gasPrice: '10' })
}

/**
 * Called when value field of "Send ETH" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
function getGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '29000' })
}

/**
 * Called when the value or address fields of "Send MET" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
function getTokensGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '26940' })
}

/**
 * Called when value field of "Buy Metronome" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
function getAuctionGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '31000' })
}

/**
 * Called when value field of "Convert ETH to MET" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
function getConvertEthGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '22000' })
}

/**
 * Called when value field of "Convert MET to ETH" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
function getConvertMetGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '23000' })
}

/**
 * Called when "Send ETH" form is confirmed and submitted
 * Returns a Promise
 */
function sendEth({ gasPrice, gasLimit, password, value, from, to }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Send MET" form is confirmed and submitted
 * Returns a Promise
 */
function sendMet({ gasPrice, gasLimit, password, value, from, to }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Buy Metronome" form is confirmed and submitted
 * Returns a Promise
 */
function buyMetronome({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert ETH to MET" form is confirmed and submitted
 * Returns a Promise
 */
function convertEth({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert MET to ETH" form is confirmed and submitted
 * Returns a Promise
 */
function convertMet({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert ETH to MET" requests a conversion estimate
 * (e.g. when amount or conversion price changes)
 * Returns a Promise
 */
function getConvertEthEstimate({ value }) {
  return fakeResponse({ result: '2300000000000000' })
}

/**
 * Called when "Convert MET to ETH" requests a conversion estimate
 * (e.g. when amount or conversion price changes)
 * Returns a Promise
 */
function getConvertMetEstimate({ value }) {
  return fakeResponse({ result: '1800000000000000' })
}

/**
 * Called when "Copy address to clipboard" is pressed
 * Returns a Promise
 */
function copyToClipboard(text) {
  return fakeResponse({ text })
}

export default function createClient (store) {
  const { config } = store.getState()

  const {
    emitter,
    events,
    wallet: { createAddress, openAccount }
  } = core.start({ config })

  events.push('create-wallet', 'open-wallets')

  events.forEach(function (event) {
    emitter.on(event, function (data) {
      store.dispatch({ type: event, payload: data })
    })
  })

  const onInit = () =>
    wallet.getAddress()
      .then(address => address || Promise.reject(new Error('No address found')))
      .then(openAccount)
      .then(() => emitter.emit('open-wallets', { walletIds: [0], activeWallet: 0 }))
      .then(() => true)
      .catch(() => false)
      .then(status => ({ onboardingComplete: status }))

  const onOnboardingCompleted = ({ mnemonic }) =>
    wallet.setAddress(createAddress(keys.mnemonicToSeedHex(mnemonic)))
      .then(() => emitter.emit('create-wallet', { walletId: 0 }))
      .then(wallet.getAddress)
      .then(openAccount)
      .then(() => emitter.emit('open-wallets', { walletIds: [0], activeWallet: 0 }))

  const api = {
    ...auth,
    onInit,
    onOnboardingCompleted,
    ...keys,
    ...utils,
    buyMetronome,
    clearCache,
    convertEth,
    convertMet,
    copyToClipboard,
    getAuctionGasLimit,
    getConvertEthEstimate,
    getConvertEthGasLimit,
    getConvertMetEstimate,
    getConvertMetGasLimit,
    getEthereumNetworkUrl,
    getGasLimit,
    getGasPrice,
    getTokensGasLimit,
    onExplorerLinkClick,
    onLoginSubmit,
    onTermsLinkClick,
    recoverFromMnemonic,
    sendEth,
    sendMet,
    setEthereumNetworkUrl
  }

  return api
}
