import { AsyncStorage } from 'react-native'

export const initialState = {
  connectivity: { isOnline: true },
  blockchain: { height: -1 },
  metronome: { transferAllowed: true },
  converter: {},
  auction: {},
  session: {
    hasEnoughData: false,
    isLoggedIn: true
  },
  rates: {},
  wallets: {}
}

const keys = [
  'blockchain',
  'converter',
  'auction',
  'rates',
  'wallets'
]

export function persistState (state) {
  console.log('>>>>>', state) // eslint-disable-line
  return Promise.all(keys.map(key =>
    AsyncStorage.setItem(key, JSON.stringify(state[key]))
  ))
}

export function getState () {
  return AsyncStorage.multiGet(keys)
    .then(function (pairs) {
      return pairs.map(([key, val]) => ([key, JSON.parse(val)]))
        .filter(pair => !!pair[1])
    })
}
