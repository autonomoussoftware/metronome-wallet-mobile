import pTimeout from 'p-timeout'

import { withAuth, getWalletId } from './utils'
import { getSeed, setSeed } from '../wallet'
import { withAnalytics } from '../analytics'
import config from '../../config'

const createWallet = ({ seed }, { emitter }) => {
  const walletId = getWalletId()
  return setSeed(seed).then(() => emitter.emit('create-wallet', { walletId }))
}

const openWallet = ({ coreApi, emitter }) => {
  const activeWallet = getWalletId()
  return getSeed()
    .then(coreApi.wallet.createAddress)
    .then(address =>
      emitter.emit('open-wallets', {
        walletIds: [activeWallet],
        activeWallet,
        address
      })
    )
}

const refreshAllTransactions = ({ address }, { coreApi, emitter }) => {
  emitter.emit('transactions-scan-started', {})
  return pTimeout(
    coreApi.transactionsSyncer.refreshAllTransactions(address),
    config.scanTransactionTimeout
  )
    .then(() => {
      emitter.emit('transactions-scan-finished', { success: true })
      return {}
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.warn('Could not sync transactions/events', error.stack)
      emitter.emit('transactions-scan-finished', {
        error: error.message,
        success: false
      })
      emitter.once('coin-block', () =>
        refreshAllTransactions({ address }, { coreApi, emitter })
      )
      return {}
    })
}

const refreshTransaction = ({ hash, address }, { coreApi }) =>
  pTimeout(
    coreApi.transactionsSyncer.refreshTransaction(hash, address),
    config.scanTransactionTimeout
  )
    .then(() => ({ success: true }))
    .catch(error => ({ error, success: false }))

const getGasLimit = (data, { coreApi }) => coreApi.wallet.getGasLimit(data)

const getGasPrice = (data, { coreApi }) => coreApi.explorer.getGasPrice(data)

const sendCoin = (data, { coreApi }) =>
  withAuth(coreApi.wallet.sendCoin)(data, { coreApi })

const getTokensGasLimit = (data, { coreApi }) =>
  coreApi.tokens.getTokensGasLimit(data)

const getAuctionGasLimit = (data, { coreApi }) =>
  coreApi.metronome.getAuctionGasLimit(data)

const getConvertCoinEstimate = (data, { coreApi }) =>
  coreApi.metronome.getConvertCoinEstimate(data)

const getConvertCoinGasLimit = (data, { coreApi }) =>
  coreApi.metronome.getConvertCoinGasLimit(data)

const getConvertMetEstimate = (data, { coreApi }) =>
  coreApi.metronome.getConvertMetEstimate(data)

const getConvertMetGasLimit = (data, { coreApi }) =>
  coreApi.metronome.getConvertMetGasLimit(data)

const buyMetronome = (data, { coreApi }) =>
  withAnalytics({
    eventCategory: 'Buy',
    eventAction: 'Buy MET in auction'
  })(withAuth(coreApi.metronome.buyMetronome))(data, { coreApi })

const convertCoin = (data, { coreApi }) =>
  withAnalytics({
    eventCategory: 'Convert',
    eventAction: 'Convert ETH to MET'
  })(withAuth(coreApi.metronome.convertCoin))(data, { coreApi })

const convertMet = (data, { coreApi }) =>
  withAnalytics({
    eventCategory: 'Convert',
    eventAction: 'Convert MET to ETH'
  })(withAuth(coreApi.metronome.convertMet))(data, { coreApi })

const sendMet = (data, { coreApi }) =>
  withAuth(coreApi.metronome.sendMet)(data, { coreApi })

const getExportMetFee = (data, { coreApi }) =>
  coreApi.metronome.getExportMetFee(data)

const getExportGasLimit = (data, { coreApi }) =>
  coreApi.metronome.estimateExportMetGas({
    ...data,
    destinationChain: config.chains[data.destinationChain].symbol,
    destinationMetAddress: config.chains[data.destinationChain].metTokenAddress,
    extraData: '0x00' // TODO: complete with extra data as needed
  })

const getImportGasLimit = (data, { coreApi }) =>
  coreApi.metronome.estimateImportMetGas(data)

const exportMetronome = (data, core) =>
  withAuth(core.coreApi.metronome.exportMet)(data, core)

const importMetronome = (data, core) =>
  withAuth(core.coreApi.metronome.importMet)(data, core)

const getMerkleRoot = (data, { coreApi }) =>
  coreApi.metronome.getMerkleRoot(data)

export default {
  refreshAllTransactions,
  getConvertCoinEstimate,
  getConvertCoinGasLimit,
  getConvertMetEstimate,
  getConvertMetGasLimit,
  refreshTransaction,
  getAuctionGasLimit,
  getExportGasLimit,
  getImportGasLimit,
  getTokensGasLimit,
  getExportMetFee,
  exportMetronome,
  importMetronome,
  getMerkleRoot,
  buyMetronome,
  createWallet,
  getGasLimit,
  getGasPrice,
  convertCoin,
  convertMet,
  openWallet,
  sendMet,
  sendCoin
}
