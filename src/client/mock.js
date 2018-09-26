const fakeResponse = (value, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      typeof value === 'string' ? reject(new Error(value)) : resolve(value)
    }, delay)
  })
}

/**
 * Called when a wallet status refresh is required (e.g. on pull-to-refresh)
 * Must return a Promise
 */
export function onWalletRefresh() {
  return fakeResponse({})
}
