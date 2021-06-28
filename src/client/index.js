import { Sentry, SentryLog } from 'react-native-sentry'
import createCore from 'metronome-wallet-core'
import { debounce } from 'lodash'
import * as Keychain from 'react-native-keychain'

import * as storage from './storage'
import * as auth from './auth'
import * as platformUtils from './platform-utils'
import { tracker } from './analytics'
import { getHandlers } from './handlers'

const startCore = ({ chain, core, config: coreConfig }, store) => {
  // eslint-disable-next-line no-console
  console.debug(`Starting core ${chain}`)
  const { emitter, events, api: coreApi } = core.start(coreConfig)

  emitter.setMaxListeners(30)

  events.push(
    'create-wallet',
    'open-wallets',
    'transactions-scan-started',
    'transactions-scan-finished'
  )

  events.forEach(event => {
    emitter.on(event, data => {
      // eslint-disable-next-line no-console
      console.debug('<<--', event, data)
      const payload = Object.assign({}, data, { chain })
      store.dispatch({ type: event, payload })
    })
  })

  emitter.on('open-wallets', ({ address }) => {
    // TODO request to rescan unconfirmed txs
    storage
      .getSyncBlock(chain)
      .then(from => {
        emitter.emit('transactions-scan-started')
        return coreApi.explorer.syncTransactions(from, address, number => storage.setSyncBlock(number, chain))
      })
      .then(() => {
        emitter.emit('transactions-scan-finished', { success: true })
        emitter.on('coin-block', function({ number }) {
          storage.setSyncBlock(number, chain).catch(function(err) {
            // eslint-disable-next-line no-console
            console.warn('Could not save new synced block', err)
          })
        })
      })
      .catch(err => {
        emitter.emit('transactions-scan-finished', { success: false })
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
const stopCore = ({ core, chain }) => {
  // eslint-disable-next-line no-console
  console.debug(`Stopping core ${chain}`)
  core.stop()
}

const createClient = (config, createStore) => {
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

  cores.forEach(function(core) {
    const { emitter, events, coreApi } = startCore(core, store)
    core.emitter = emitter
    core.events = events
    core.coreApi = coreApi
  })

  const api = getHandlers(cores)

  const sanitizeStorage = () =>
    Promise.all([
      platformUtils.getSettingsVersion(),
      platformUtils.shouldRestartSettings()
    ])
      .then(([version, shouldRestartSettings]) => {
        const promises = []
        if (!version || version === 0) {
          console.debug('Cleaning keychain settings')
          // Clean Keychain as this is the first time running the app ever or
          // the first time after reinstall
          promises.push(
            Keychain.resetInternetCredentials('wallet.seed'),
            Keychain.resetInternetCredentials('wallet.pin')
          )
        }
        if (shouldRestartSettings) {
          // eslint-disable-next-line no-console
          console.debug('Restarting settings')
          promises.push(
            config.enabledChains.map(chain => storage.setSyncBlock(0, chain)),
            storage.persistState([])
          )
        }
        return Promise.all(promises)
      })
      .then(platformUtils.saveSettingsVersion)
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn('Failed setting up store and dispatching events', err)
      })

  const onInit = () => {
    tracker.trackEvent('App', 'App initiated')
    return sanitizeStorage().then(() =>
      auth
        .getHashedPIN()
        .then(pin => pin || Promise.reject(new Error('No pin found')))
        .then(storage.getState)
        .then(persistedState => ({
          onboardingComplete: true,
          persistedState: persistedState || {}
        }))
        .catch(() => ({
          onboardingComplete: false,
          persistedState: {}
        }))
        .then(data => {
          const debounceTime = config.statePersistanceDebounce || 2000
          store.subscribe(
            debounce(
              () => storage.persistState(store.getState()),
              debounceTime,
              {
                maxWait: 2 * debounceTime
              }
            )
          )
          return {
            ...data,
            config
          }
        })
    )
  }

  return { ...api, onInit, store }
}

export default createClient
