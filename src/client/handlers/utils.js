import { validatePIN } from '../auth'
import { getSeed } from '../wallet'

export const withAuth = fn => (transactionObject, { coreApi }) =>
  validatePIN(transactionObject.password)
    .then(getSeed)
    .then(coreApi.wallet.createPrivateKey)
    .then(privateKey => fn(privateKey, transactionObject))

export const getWalletId = () => 1

export const findCoreByChainName = (cores, chain) =>
  cores.find(e => e.chain === chain)

export const findCoreBySymbol = (cores, ticker) =>
  cores.find(e => e.config.symbol === ticker)
