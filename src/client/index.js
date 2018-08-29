import core from 'metronome-wallet-core'

import * as storage from './storage'
import * as auth from './auth'
import * as keys from './keys'
import * as utils from './utils'
import * as wallet from './wallet'

import * as mock from './mock'

export default function createClient(config, createStore) {
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

  storage.getState()
    .catch(function (err) {
      console.warn('Could not get persisted state', err)
      return []
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

      events.push('create-wallet', 'open-wallets')

      events.forEach(function (event) {
        emitter.on(event, function (data) {
          // console.log('<<--', event, data)
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
      .then(() => ({ onboardingComplete: true }))
      .catch(err => ({ onboardingComplete: false, err }))

  const onOnboardingCompleted = ({ mnemonic }) => {
    const { address, privateKey } = coreApi.wallet.getAddressAndPrivateKey(keys.mnemonicToSeedHex(mnemonic))
    return Promise.all([wallet.setAddress(address), wallet.setPrivateKey(privateKey)])
      .then(() => emitter.emit('create-wallet', { walletId: 1 }))
      .then(() => emitter.emit('open-wallets', { walletIds: [1], activeWallet: 1, address }))
  }

  // TODO move this logic into the explorer plugin
  emitter.on('open-wallets', function ({ address }) {
    // TODO request to rescan unconfirmed txs

    storage.getSyncBlock()
      .then(function (from) {
        return coreApi.explorer.syncTransactions(from, address)
      })
      .then(storage.setSyncBlock)
          .then(function () {
            emitter.on('eth-block', function ({ number }) {
              storage.setSyncBlock(number)
                .catch(function (err) {
                  console.warn('Could not save new synced block', err)
      })
            })
          })
      .catch(function (err) {
        console.warn('Could not sync transactions/events', err)
      })
  })

  const withAuth = fn => function (transactionObject) {
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
    buyMetronome: withAuth(coreApi.metronome.buyMetronome),
    convertEth: withAuth(coreApi.metronome.convertEth),
    convertMet: withAuth(coreApi.metronome.convertMet),
    onInit,
    onOnboardingCompleted,
    sendEth: withAuth(coreApi.wallet.sendEth),
    sendMet: withAuth(coreApi.metronome.sendMet),
    store,
    ...mock
  }

  return api
}
