const fakeResponse = (value, delay = 500) => {
  const response = new Promise((resolve, reject) => {
    setTimeout(() => {
      typeof value === 'string' ? reject(new Error(value)) : resolve(value)
    }, delay)
  })
  return response
}

/**
 * Called when a wallet status refresh is required (e.g. on pull-to-refresh)
 * Must return a Promise
 */
export function onWalletRefresh() {
  return fakeResponse({})
}
