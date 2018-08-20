import { AsyncStorage } from 'react-native'

const keysToPersist = [
  // 'auction',
  'blockchain',
  // 'converter',
  'rates',
  'wallets'
]

// TODO move to lib/promise-throttle
function promiseThrottle (fn) {
  let promise = Promise.resolve()
  return function (...args) {
    return promise
      .catch()
      .then(fn(...args))
  }
}

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
