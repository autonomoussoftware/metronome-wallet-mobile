import createCore from 'metronome-wallet-core'
import { debounce } from 'lodash'

import { Sentry, SentryLog } from 'react-native-sentry'
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
      .getSyncBlock()
      .then(from => {
        store.dispatch({ type: 'transactions-scan-started' })
        return coreApi.explorer.syncTransactions(from, address)
      })
      .then(number => storage.setSyncBlock(number, chain))
      .then(() => {
        store.dispatch({
          type: 'transactions-scan-finished',
          payload: { success: true }
        })
        emitter.on('coin-block', function({ number }) {
          storage.setSyncBlock(number, chain).catch(function(err) {
            // eslint-disable-next-line no-console
            console.warn('Could not save new synced block', err)
          })
        })
      })
      .catch(err => {
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

  const onInit = () => {
    tracker.trackEvent('App', 'App initiated')
    return auth
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
          debounce(() => storage.persistState(store.getState()), debounceTime, {
            maxWait: 2 * debounceTime
          })
        )
        return {
          ...data,
          config
        }
      })
  }

  platformUtils
    .shouldRestartSettings()
    .then(shouldRestartSettings => {
      if (shouldRestartSettings) {
        // eslint-disable-next-line no-console
        console.debug('Restarting settings')
        return Promise.all([
          config.enabledChains.map(chain => storage.setSyncBlock(0, chain)),
          storage.persistState([])
        ])
      }
    })
    .then(platformUtils.saveSettingsVersion)
    .catch(err => {
      // eslint-disable-next-line no-console
      console.warn('Failed setting up store and dispatching events', err)
    })

  return { ...api, onInit, store }
}

export default createClient
