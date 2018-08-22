import core from 'metronome-wallet-core'

import {
  getState,
  persistState
} from './store'
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
 * Called when "Copy address to clipboard" is pressed
 * Returns a Promise
 */
function copyToClipboard(text) {
  return fakeResponse({ text })
}

export default function createClient(config, createStore) {
  const {
    emitter,
    events,
    api: coreApi
  } = core.start({ config })

  const reduxDevtoolsOptions = {
    actionsBlacklist: ['price-updated$'],
    features: { dispatch: true },
    maxAge: 100 // default: 50
  }

  const store = createStore(
    reduxDevtoolsOptions,
    { config }
  )

  getState()
    .catch(function (err) {
      console.warn('Could not get persisted state', err)
      return []
    })
    .then(function (pairs) {
      const stateToEvent = {
        blockchain: 'blockchain-set',
        converter: 'mtn-converter-status-updated',
        auction: 'auction-status-updated',
        rates: 'rates-set',
        wallets: 'wallets-set'
      }

      pairs.forEach(function ([key, value]) {
        store.dispatch({ type: stateToEvent[key], payload: value })
      })

      store.subscribe(function () {
        persistState(store.getState())
      })

      events.push('create-wallet', 'open-wallets')

      events.forEach(function (event) {
        emitter.on(event, function (data) {
          console.log('<<--', event, data)
          store.dispatch({ type: event, payload: data })
        })
      })
    })
    .catch(function (err) {
      console.warn('Failed setting up store and dispatching events', err)
    })

  const onInit = () =>
    wallet.getAddress()
      // .then(() => null) // HACK force onboarding
      .then(address => address || Promise.reject(new Error('No address found')))
      .then(address => emitter.emit('open-wallets', { walletIds: [1], activeWallet: 1, address }))
      .then(() => true)
      .catch(() => false)
      .then(status => ({ onboardingComplete: status }))

  const onOnboardingCompleted = ({ mnemonic }) => {
    const { address, privateKey } = coreApi.wallet.getAddressAndPrivateKey(keys.mnemonicToSeedHex(mnemonic))
    return Promise.all([wallet.setAddress(address), wallet.setPrivateKey(privateKey)])
      .then(() => emitter.emit('create-wallet', { walletId: 1 }))
      .then(() => emitter.emit('open-wallets', { walletIds: [1], activeWallet: 1, address }))
  }

  const authAnd = fn => function (transactionObject) {
    // TODO check options.password is valid
    return wallet.getPrivateKey()
      .then(function (privateKey) {
        return fn(privateKey, transactionObject)
      })
  }

  const api = {
    ...auth,
    ...coreApi.metronome,
    ...coreApi.tokens,
    ...coreApi.wallet,
    ...keys,
    ...utils,
    buyMetronome: authAnd(coreApi.metronome.buyMetronome),
    clearCache,
    convertEth: authAnd(coreApi.metronome.convertEth),
    convertMet: authAnd(coreApi.metronome.convertMet),
    copyToClipboard,
    getEthereumNetworkUrl,
    onExplorerLinkClick,
    onInit,
    onLoginSubmit,
    onOnboardingCompleted,
    onTermsLinkClick,
    recoverFromMnemonic,
    sendEth: authAnd(coreApi.wallet.sendEth),
    sendMet: authAnd(coreApi.metronome.sendMet),
    setEthereumNetworkUrl,
    store
  }

  return api
}
