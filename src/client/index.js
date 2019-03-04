import createCore from 'metronome-wallet-core'
import { Sentry, SentryLog } from 'react-native-sentry'

import * as storage from './storage'
import * as auth from './auth'
import * as keys from './keys'
import * as platformUtils from './platform-utils'
import * as utils from './utils'
import * as wallet from './wallet'
import { withAnalytics, tracker } from './analytics'

const getWalletId = () => 1

function startCore ({ chain, core, config: coreConfig }, store) {
  // eslint-disable-next-line no-console
  console.log(`Starting core ${chain}`)
  const { emitter, events, api: coreApi } = core.start(coreConfig)

  emitter.setMaxListeners(30)

  events.push(
    'create-wallet',
    'open-wallets',
    'transactions-scan-started',
    'transactions-scan-finished'
  )

  events.forEach(function (event) {
    emitter.on(event, function (data) {
      // eslint-disable-next-line no-console
      console.debug('<<--', event, data)
      const payload = Object.assign({}, data, { chain })
      store.dispatch({ type: event, payload })
    })
  })

  emitter.on('open-wallets', function ({ address }) {
    // TODO request to rescan unconfirmed txs
    storage
      .getSyncBlock()
      .then(function (from) {
        store.dispatch({ type: 'transactions-scan-started' })
        return coreApi.explorer.syncTransactions(from, address)
      })
      .then(storage.setSyncBlock)
      .then(function () {
        store.dispatch({
          type: 'transactions-scan-finished',
          payload: { success: true }
        })
        emitter.on('eth-block', function ({ number }) {
          storage.setSyncBlock(number).catch(function (err) {
            // eslint-disable-next-line no-console
            console.warn('Could not save new synced block', err)
          })
        })
      })
      .catch(function (err) {
        store.dispatch({
          type: 'transactions-scan-finished',
          payload: { success: true }
        })
        // eslint-disable-next-line no-console
        console.warn('Could not sync transactions/events', err)
      })
  })

  // eslint-disable-next-line no-console
  emitter.on('wallet-error', console.warn)

  return {
    emitter,
    events,
    coreApi
  }
}
// eslint-disable-next-line no-unused-vars
function stopCore ({ core, chain }) {
  // eslint-disable-next-line no-console
  console.log(`Stopping core ${chain}`)
  core.stop()
}

export default function createClient (config, createStore) {
  if (config.sentryDsn) {
    Sentry.config(config.sentryDsn, {
      logLevel: SentryLog.Error
    }).install()
  }

  const reduxDevtoolsOptions = {
    actionsBlacklist: ['price-updated$'],
    features: { dispatch: true },
    maxAge: 100 // default: 50
  }

  const store = createStore(reduxDevtoolsOptions, { config })

  const cores = config.enabledChains.map(chainName => ({
    chain: chainName,
    core: createCore(),
    config: Object.assign({}, config.chains[chainName], config)
  }))

  cores.forEach(function (core) {
    const { emitter, events, coreApi } = startCore(core, store)
    core.emitter = emitter
    core.events = events
    core.coreApi = coreApi
  })

  const openWallet = ({ coreApi, emitter }) => {
    const activeWallet = getWalletId()
    return wallet
      .getSeed()
      .then(coreApi.wallet.createAddress)
      .then(address =>
        emitter.emit('open-wallets', {
          walletIds: [activeWallet],
          activeWallet,
          address
        })
      )
  }

  const onInit = () => {
    tracker.trackEvent('App', 'App initiated')
    return auth
      .getHashedPIN()
      .then(pin => pin || Promise.reject(new Error('No pin found')))
      .then(wallet.getSeed)
      .then(storage.getState)
      .then(persistedState => ({
        onboardingComplete: true,
        persistedState: persistedState || {}
      }))
      .catch(err => ({
        onboardingComplete: false,
        err,
        persistedState: {}
      }))
      .then(data => {
        store.subscribe(function () {
          storage.persistState(store.getState())
        })
        return {
          ...data,
          config
        }
      })
  }

  const onOnboardingCompleted = ({ mnemonic, password }) => {
    const seed = keys.mnemonicToSeedHex(mnemonic)
    const activeWallet = getWalletId()
    return Promise.all([wallet.setSeed(seed), auth.setPIN(password)])
      .then(() =>
        cores[0].emitter.emit('create-wallet', { walletId: activeWallet })
      )
      .then(() =>
        cores[0].emitter.emit('open-wallets', {
          walletIds: [activeWallet],
          activeWallet,
          address: cores[0].coreApi.wallet.createAddress(seed)
        })
      )
  }

  const withAuth = fn =>
    function (transactionObject) {
      return auth
        .validatePIN(transactionObject.password)
        .then(wallet.getSeed)
        .then(cores[0].coreApi.wallet.createPrivateKey)
        .then(function (privateKey) {
          return fn(privateKey, transactionObject)
        })
    }

  platformUtils
    .shouldRestartSettings()
    .then(function (shouldRestartSettings) {
      if (shouldRestartSettings) {
        return Promise.all([storage.setSyncBlock(0), storage.persistState([])])
      }
    })
    .then(function () {
      store.subscribe(function () {
        storage.persistState(store.getState())
      })
    })
    .then(platformUtils.saveSettingsVersion)
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed setting up store and dispatching events', err)
    })

  const onLoginSubmit = ({ password }) =>
    auth.validatePIN(password).then(function (isValid) {
      if (isValid) {
        openWallet(cores[0])
      }
      return isValid
    })

  const api = {
    ...auth,
    ...cores[0].coreApi.metronome,
    ...cores[0].coreApi.explorer,
    ...cores[0].coreApi.tokens,
    ...cores[0].coreApi.wallet,
    ...keys,
    ...platformUtils,
    ...utils,
    buyMetronome: withAnalytics({
      eventCategory: 'Buy',
      eventAction: 'Buy MET in auction'
    })(withAuth(cores[0].coreApi.metronome.buyMetronome)),
    convertEth: withAnalytics({
      eventCategory: 'Convert',
      eventAction: 'Convert ETH to MET'
    })(withAuth(cores[0].coreApi.metronome.convertEth)),
    convertMet: withAnalytics({
      eventCategory: 'Convert',
      eventAction: 'Convert MET to ETH'
    })(withAuth(cores[0].coreApi.metronome.convertMet)),
    onInit,
    onOnboardingCompleted,
    onLoginSubmit,
    sendEth: withAuth(cores[0].coreApi.wallet.sendEth),
    sendMet: withAuth(cores[0].coreApi.metronome.sendMet),
    store
  }

  return api
}
