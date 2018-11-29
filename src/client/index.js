import core from 'metronome-wallet-core'
import { Sentry, SentryLog } from 'react-native-sentry'

import * as storage from './storage'
import * as auth from './auth'
import * as keys from './keys'
import * as platformUtils from './platform-utils'
import * as utils from './utils'
import * as wallet from './wallet'
import { withAnalytics, tracker } from './analytics'

export default function createClient(config, createStore) {

  if (config.SENTRY_DSN) {
    Sentry.config(config.SENTRY_DSN, {
      logLevel: SentryLog.Error
    }).install()
  }

  const reduxDevtoolsOptions = {
    actionsBlacklist: ['price-updated$'],
    features: { dispatch: true },
    maxAge: 100 // default: 50
  }

  const store = createStore(
    reduxDevtoolsOptions,
    { config }
  )

  const {
    emitter,
    events,
    api: coreApi
  } = core.start({ config })

  events.push('create-wallet', 'open-wallets')

  events.forEach(function (event) {
    emitter.on(event, function (data) {
      // console.log('<<--', event, data)
      store.dispatch({ type: event, payload: data })
    })
  })

  Promise.all([storage.getState(), platformUtils.shouldRestartSettings()])
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn('Could not get persisted state', err)
      return [[], false]
    })
    .then(function ([pairs, shouldRestartSettings]) {
      if (shouldRestartSettings) {
        return Promise.all([
          storage.setSyncBlock(0),
          storage.persistState([])
        ]).then(() => [])
      }
      return pairs
    })
    .then(function (pairs) {
      const stateToEvent = {
        blockchain: 'blockchain-set',
        rates: 'rates-set',
        wallets: 'wallets-set'
      }

      pairs.forEach(function ([key, value]) {
        store.dispatch({ type: stateToEvent[key], payload: value })
      })

      store.subscribe(function () {
        storage.persistState(store.getState())
      })
    })
    .then(() => platformUtils.saveSettingsVersion())
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed setting up store and dispatching events', err)
    })

  const onInit = () => {
    tracker.trackEvent('App', 'App initiated')
    return auth.getHashedPIN()
      .then(pin => pin || Promise.reject(new Error('No pin found')))
      .then(wallet.getSeed)
      .then(coreApi.wallet.createAddress)
      .then(address => emitter.emit('open-wallets', { walletIds: [1], activeWallet: 1, address }))
      .then(() => ({ onboardingComplete: true }))
      .catch(err => ({ onboardingComplete: false, err }))
  }

  const onOnboardingCompleted = ({ mnemonic, password }) => {
    const seed = keys.mnemonicToSeedHex(mnemonic)
    return Promise.all([wallet.setSeed(seed), auth.setPIN(password)])
      .then(() => emitter.emit('create-wallet', { walletId: 1 }))
      .then(() => emitter.emit('open-wallets', {
        walletIds: [1],
        activeWallet: 1,
        address: coreApi.wallet.createAddress(seed)
      }))
  }

  // TODO move this logic into the explorer plugin
  emitter.on('open-wallets', function ({ address }) {
    // TODO request to rescan unconfirmed txs
    storage.getSyncBlock()
      .then(function (from) {
        store.dispatch({ type: 'transactions-scan-started' })
        return coreApi.explorer.syncTransactions(from, address)
      })
      .then(storage.setSyncBlock)
      .then(function () {
        store.dispatch({ type: 'transactions-scan-finished' })
        emitter.on('eth-block', function ({ number }) {
          storage.setSyncBlock(number)
            .catch(function (err) {
              // eslint-disable-next-line no-console
              console.warn('Could not save new synced block', err)
            })
        })
      })
      .catch(function (err) {
        store.dispatch({ type: 'transactions-scan-finished' })
        // eslint-disable-next-line no-console
        console.warn('Could not sync transactions/events', err)
      })
  })

  // eslint-disable-next-line no-console
  emitter.on('wallet-error', console.warn)

  const withAuth = fn => function (transactionObject) {
    return auth.validatePIN(transactionObject.password)
      .then(wallet.getSeed)
      .then(coreApi.wallet.createPrivateKey)
      .then(function (privateKey) {
        return fn(privateKey, transactionObject)
      })
  }

  const api = {
    ...auth,
    ...coreApi.metronome,
    ...coreApi.explorer,
    ...coreApi.tokens,
    ...coreApi.wallet,
    ...keys,
    ...platformUtils,
    ...utils,
    buyMetronome: withAnalytics({
      eventCategory: 'Buy',
      eventAction: 'Buy MET in auction'
    })(withAuth(coreApi.metronome.buyMetronome)),
    convertEth: withAnalytics({
      eventCategory: 'Convert',
      eventAction: 'Convert ETH to MET'
    })(withAuth(coreApi.metronome.convertEth)),
    convertMet: withAnalytics({
      eventCategory: 'Convert',
      eventAction: 'Convert MET to ETH'
    })(withAuth(coreApi.metronome.convertMet)),
    onInit,
    onOnboardingCompleted,
    sendEth: withAuth(coreApi.wallet.sendEth),
    sendMet: withAuth(coreApi.metronome.sendMet),
    store
  }

  return api
}
