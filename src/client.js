import core from 'metronome-wallet-core'
import fastPasswordEntropy from 'fast-password-entropy'
import bip39 from 'react-native-bip39'
import utils from 'web3-utils'

const fakeResponse = (value, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      typeof value === 'string' ? reject(new Error(value)) : resolve(value)
    }, delay)
  })
}

export const getStringEntropy = str => fastPasswordEntropy(str)

export const isAddress = str => utils.isAddress(str)

export const fromWei = (str, unit = 'ether') => utils.fromWei(str, unit)

export const toWei = (bn, unit = 'ether') => utils.toWei(bn, unit)

export const toHex = bn => utils.toHex(bn)

export const toBN = str => utils.toBN(str)

/**
 * Called when app starts
 * Returns a Promise that resolves to an object { onboardingComplete: Bool }
 */
export function onInit() {
  return fakeResponse({ onboardingComplete: true }, 0)
}

/**
 * Called when the onboarding process is finished
 * Returns a Promise thet resolves if password and mnemonic are valid
 */
export function onOnboardingCompleted({ password, mnemonic }) {
  alert(`password: ${password} - mnemonic: ${mnemonic}`)
  return fakeResponse({})
}

/**
 * Called when login/unlock form is submitted
 * Returns a Promise
 */
export function onLoginSubmit({ password }) {
  return fakeResponse({ password })
}

/**
 * Called when the link "Terms & Conditions" is clicked
 * It should trigger opening the link with the platform default browser
 */
export function onTermsLinkClick() {
  return fakeResponse({})
}

/**
 * Called when the link "Open in Explorer" is clicked
 * It should trigger opening the link with the platform default browser
 */
export function onExplorerLinkClick() {
  return fakeResponse({})
}

/**
 * Called by onboarding process to create a new wallet
 * Must return a Promise that resolves to the mnemonic string to be consistent
 * with React Native BIP 39
 */
export function createMnemonic() {
  return bip39.generateMnemonic()
  // return Promise.resolve(
  //   'foo house bar plane baz micro gulp sans letter zero metro mayer'
  // );
}

/**
 * Called by "Recover wallet from mnemonic" form
 * Must return a Promise
 */
export function recoverFromMnemonic({ mnemonic, password }) {
  return fakeResponse({ mnemonic, password })
}

/**
 * Called when clicking "Clear cache" button in "Settings" screen
 * Must return a Promise
 */
export function clearCache() {
  return fakeResponse({})
}

/**
 * Called when prefilling the Ethereum network URL field in "Settings" screen
 * Must return a Promise
 */
export function getEthereumNetworkUrl() {
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
export function setEthereumNetworkUrl({ ethereumNetworkUrl }) {
  // Reference implementation in desktop wallet:
  //
  // ipcRenderer.sendSync('settings-set', {
  //   key: 'app.node.websocketApiUrl',
  //   value: this.state.ethereumNetworkUrl
  // });
  return fakeResponse({})
}

export function isValidMnemonic(str) {
  return bip39.validateMnemonic(str)
}

/**
 * Called when the gas editor is mounted
 * Returns a Promise that resolves to an object { gasPrice: String }
 * Gas price is returned in wei
 */
export function getGasPrice() {
  return fakeResponse({ gasPrice: '10' })
}

/**
 * Called when value field of "Send ETH" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
export function getGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '29000' })
}

/**
 * Called when the value or address fields of "Send MET" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
export function getTokensGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '26940' })
}

/**
 * Called when value field of "Buy Metronome" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
export function getAuctionGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '31000' })
}

/**
 * Called when value field of "Convert ETH to MET" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
export function getConvertEthGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '22000' })
}

/**
 * Called when value field of "Convert MET to ETH" form changes
 * Returns a Promise that resolves to an object { gasLimit: String }
 * Gas price is returned in wei
 */
export function getConvertMetGasLimit({ value, from }) {
  return fakeResponse({ gasLimit: '23000' })
}

/**
 * Called when "Send ETH" form is confirmed and submitted
 * Returns a Promise
 */
export function sendEth({ gasPrice, gasLimit, password, value, from, to }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Send MET" form is confirmed and submitted
 * Returns a Promise
 */
export function sendMet({ gasPrice, gasLimit, password, value, from, to }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Buy Metronome" form is confirmed and submitted
 * Returns a Promise
 */
export function buyMetronome({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert ETH to MET" form is confirmed and submitted
 * Returns a Promise
 */
export function convertEth({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert MET to ETH" form is confirmed and submitted
 * Returns a Promise
 */
export function convertMet({ gasPrice, gasLimit, password, value, from }) {
  return fakeResponse({}, 1500)
}

/**
 * Called when "Convert ETH to MET" requests a conversion estimate
 * (e.g. when amount or conversion price changes)
 * Returns a Promise
 */
export function getConvertEthEstimate({ value }) {
  return fakeResponse({ result: '2300000000000000' })
}

/**
 * Called when "Convert MET to ETH" requests a conversion estimate
 * (e.g. when amount or conversion price changes)
 * Returns a Promise
 */
export function getConvertMetEstimate({ value }) {
  return fakeResponse({ result: '1800000000000000' })
}

/**
 * Called when "Copy address to clipboard" is pressed
 * Returns a Promise
 */
export function copyToClipboard(text) {
  return fakeResponse({ text })
}

export default function createClient (store) {

  const { emitter } = core.start()

  const events = [
    'eth-price-updated'
  ]

  events.forEach(function (event) {
    emitter.on(event, function (data) {
      store.dispatch({ type: event, payload: data })
    })
  })

  const api = {
    buyMetronome,
    clearCache,
    convertEth,
    convertMet,
    copyToClipboard,
    createMnemonic,
    fromWei,
    getAuctionGasLimit,
    getConvertEthEstimate,
    getConvertEthGasLimit,
    getConvertMetEstimate,
    getConvertMetGasLimit,
    getEthereumNetworkUrl,
    getGasLimit,
    getGasPrice,
    getStringEntropy,
    getTokensGasLimit,
    isAddress,
    isValidMnemonic,
    onExplorerLinkClick,
    onInit,
    onLoginSubmit,
    onOnboardingCompleted,
    onTermsLinkClick,
    recoverFromMnemonic,
    sendEth,
    sendMet,
    setEthereumNetworkUrl,
    toBN,
    toHex,
    toWei
  }

  return api
}
