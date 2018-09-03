const fakeResponse = (value, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      typeof value === 'string' ? reject(new Error(value)) : resolve(value)
    }, delay)
  })
}

/**
 * Called by "Recover wallet from mnemonic" form
 * Must return a Promise
 */
export function recoverFromMnemonic({ mnemonic, password }) {
  return fakeResponse({ mnemonic, password })
}

/**
 * Called when clicking "Clear cache" button in "Settings" screen
 * Must return a Promise
 */
export function clearCache() {
  return fakeResponse({})
}

/**
 * Called when prefilling the Ethereum network URL field in "Settings" screen
 * Must return a Promise
 */
export function getEthereumNetworkUrl() {
  // Reference implementation in desktop wallet:
  //
  // ipcRenderer.sendSync('settings-get', {
  //   key: 'app.node.websocketApiUrl'
  // });
  return fakeResponse({ ethereumNetworkUrl: 'ws://parity.bloqrock.net:8546' })
}

/**
 * Called when updating the Ethereum network URL from "Settings" screen
 * Must return a Promise
 */
export function setEthereumNetworkUrl({ ethereumNetworkUrl }) {
  // Reference implementation in desktop wallet:
  //
  // ipcRenderer.sendSync('settings-set', {
  //   key: 'app.node.websocketApiUrl',
  //   value: this.state.ethereumNetworkUrl
  // });
  return fakeResponse({})
}
