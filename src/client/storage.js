import { AsyncStorage } from 'react-native'

import promiseThrottle from './promise-throttle'

const keysToPersist = [
  'blockchain',
  'rates',
  'wallets'
]

export const persistState = promiseThrottle(function (state) {
  console.log('Persisting state', state)

  return Promise.all(keysToPersist.map(key =>
    AsyncStorage.setItem(key, JSON.stringify(state[key]))
  ))
})

export function getState () {
  return AsyncStorage.multiGet(keysToPersist)
    .then(function (pairs) {
      return pairs.map(([key, val]) => ([key, JSON.parse(val)]))
        .filter(pair => !!pair[1])
    })
}

export function getBestBlock () {
  return AsyncStorage.getItem('blockchain')
    .then(value => value ? JSON.parse(value).height : null)
}

export function setSyncBlock (number) {
  console.log('Setting sync block', number)
  
  return AsyncStorage.setItem('sync', number.toString())
}

export function getSyncBlock () {
  return AsyncStorage.getItem('sync')
    .then(number => number ? Number.parseInt(number, 10) : 0)
}
