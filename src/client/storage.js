import AsyncStorage from '@react-native-async-storage/async-storage'

import promiseThrottle from './promise-throttle'

const keysToPersist = ['chains']

const mapToObject = array =>
  array.reduce((acum, current) => {
    acum[current.type] = current.data
    return acum
  }, {})

export const persistState = promiseThrottle(function(state) {
  // eslint-disable-next-line no-console
  console.debug('Persisting state', state)

  return Promise.all(
    keysToPersist.map(key =>
      AsyncStorage.setItem(key, JSON.stringify(state[key] || null))
    )
  )
})

export const getState = () =>
  AsyncStorage.multiGet(keysToPersist).then(pairs =>
    mapToObject(
      pairs.map(([key, val]) => ({ type: key, data: JSON.parse(val) }))
    )
  )

export const getBestBlock = () =>
  AsyncStorage.getItem('blockchain').then(value =>
    value ? JSON.parse(value).height : null
  )

export const setSyncBlock = (number, chain) => {
  // eslint-disable-next-line no-console
  console.debug(`${chain}\t- Setting sync block: ${number}`)
  return AsyncStorage.setItem(`sync-${chain}`, number.toString())
}

export const getSyncBlock = chain =>
  AsyncStorage.getItem(`sync-${chain}`).then(number =>
    number ? Number.parseInt(number, 10) : 0
  )
