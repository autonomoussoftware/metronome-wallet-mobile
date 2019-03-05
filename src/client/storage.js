import { AsyncStorage } from 'react-native'

import promiseThrottle from './promise-throttle'

const keysToPersist = ['chains']

const mapToObject = array =>
  array.reduce(function (acum, current) {
    acum[current.type] = current.data
    return acum
  }, {})

export const persistState = promiseThrottle(function (state) {
  // eslint-disable-next-line no-console
  console.debug('Persisting state', state)

  return Promise.all(
    keysToPersist.map(key =>
      AsyncStorage.setItem(key, JSON.stringify(state[key] || null))
    )
  )
})

export function getState () {
  return AsyncStorage.multiGet(keysToPersist).then(pairs =>
    mapToObject(
      pairs.map(([key, val]) => ({ type: key, data: JSON.parse(val) }))
    )
  )
}

export function getBestBlock () {
  return AsyncStorage.getItem('blockchain').then(value =>
    value ? JSON.parse(value).height : null
  )
}

export function setSyncBlock (number) {
  // eslint-disable-next-line no-console
  console.log('Setting sync block', number)
  return AsyncStorage.setItem('sync', number.toString())
}

export function getSyncBlock () {
  return AsyncStorage.getItem('sync').then(number =>
    number ? Number.parseInt(number, 10) : 0
  )
}
