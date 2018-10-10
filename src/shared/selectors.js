import { createSelector } from 'reselect'
import * as utils from './utils'
import _ from 'lodash'

export const getClient = (props, client) => client

export const getConfig = state => state.config

export const getConnectivity = state => state.connectivity

export const getIsOnline = createSelector(
  getConnectivity,
  connectivityStatus => connectivityStatus.isOnline
)

export const getIsLoggedIn = state => state.session.isLoggedIn

export const isSessionActive = createSelector(getIsLoggedIn, pass => !!pass)

const getWalletsById = state => state.wallets.byId

const getActiveWalletId = state => state.wallets.active

const getActiveWalletData = createSelector(
  getActiveWalletId,
  getWalletsById,
  (activeId, walletsById) => _.get(walletsById, activeId, null)
)

const getActiveWalletAddresses = createSelector(
  getActiveWalletData,
  activeWallet =>
    _.get(activeWallet, 'addresses', null)
      ? Object.keys(activeWallet.addresses)
      : null
)

export const getActiveAddress = createSelector(
  getActiveWalletAddresses,
  addresses => _.get(addresses, 0, null)
)

const getActiveAddressData = createSelector(
  getActiveWalletData,
  getActiveAddress,
  (activeWallet, activeAddress) =>
    _.get(activeWallet, ['addresses', activeAddress], null)
)

export const getActiveWalletEthBalance = createSelector(
  getActiveAddressData,
  activeAddressData => _.get(activeAddressData, 'balance', null)
)

export const getActiveWalletMtnBalance = createSelector(
  getActiveAddressData,
  getConfig,
  (activeAddressData, config) =>
    _.get(activeAddressData, ['token', config.MTN_TOKEN_ADDR, 'balance'], null)
)

export const getRates = state => state.rates

export const getEthRate = createSelector(
  getRates,
  ({ ETH }) => (ETH ? ETH.price : null)
)

export const getMtnRate = createSelector(
  getRates,
  ({ MTN }) => (MTN ? MTN.price : null)
)

export const getMtnBalanceWei = getActiveWalletMtnBalance

// TODO implement when we have a definition about MTN:USD rate
export const getMtnBalanceUSD = () => '0'

export const getEthBalanceWei = getActiveWalletEthBalance

export const getEthBalanceUSD = createSelector(
  getActiveWalletEthBalance,
  getEthRate,
  getClient,
  (balance, ethRate, client) => {
    if (!balance || !ethRate) return '0'
    const usdValue = parseFloat(client.fromWei(balance)) * ethRate
    return usdValue.toFixed(2)
  }
)

export const getAuction = state => state.auction

export const getAuctionStatus = createSelector(
  getAuction,
  auction => auction.status
)

export const getCurrentAuction = createSelector(
  getAuctionStatus,
  auctionStatus =>
    auctionStatus && auctionStatus.currentAuction
      ? auctionStatus.currentAuction
      : '-1'
)

export const getAuctionPriceUSD = createSelector(
  getAuctionStatus,
  getEthRate,
  getClient,
  (auctionStatus, ethRate, client) => {
    if (!auctionStatus || !ethRate) return '0'
    const usdValue =
      parseFloat(client.fromWei(auctionStatus.currentPrice)) * ethRate
    return usdValue.toFixed(2)
  }
)

export const getConverter = state => state.converter

export const getConverterStatus = createSelector(
  getConverter,
  converter => converter.status
)

export const getConverterPrice = createSelector(
  getConverterStatus,
  converterStatus => _.get(converterStatus, 'currentPrice', null)
)

export const getConverterPriceUSD = createSelector(
  getConverterStatus,
  getEthRate,
  getClient,
  (converterStatus, ethRate, client) => {
    if (!converterStatus || !ethRate) return '0'
    const usdValue =
      parseFloat(client.fromWei(converterStatus.currentPrice)) * ethRate
    return usdValue.toFixed(2)
  }
)

export const getBlockchain = state => state.blockchain

export const getBlockHeight = createSelector(
  getBlockchain,
  blockchain => blockchain.height
)

/**
 * Returns the amount of confirmations for a given transaction
 */
export const getTxConfirmations = createSelector(
  getBlockHeight,
  (state, props) => props.tx.blockNumber,
  (blockHeight, txBlockNumber) =>
    txBlockNumber === null || txBlockNumber > blockHeight
      ? 0
      : blockHeight - txBlockNumber + 1
)

/**
 * Returns the array of transactions of the current wallet/address.
 * The items are mapped to contain properties useful for rendering.
 */
export const getActiveWalletTransactions = createSelector(
  getActiveAddressData,
  getActiveAddress,
  (activeAddressData, activeAddress) => {
    const transactionParser = utils.createTransactionParser(activeAddress)

    const transactions = _.get(activeAddressData, 'transactions', [])

    return _.sortBy(transactions, [
      'transaction.blockNumber',
      'transaction.transactionIndex',
      'transaction.nonce'
    ])
      .reverse()
      .map(transactionParser)
  }
)

export const hasTransactions = createSelector(
  getActiveWalletTransactions,
  transactions => transactions.length > 0
)

export const hasEnoughData = state => state.session.hasEnoughData

/**
 * Returns the status of the "Send" feature (both ETH and MET)
 */
export const sendFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getActiveWalletMtnBalance,
  getIsOnline,
  (ethBalance, mtnBalance, isOnline) =>
    !isOnline
      ? 'offline'
      : !utils.hasFunds(ethBalance) && !utils.hasFunds(mtnBalance)
        ? 'no-funds'
        : 'ok'
)

/**
 * Returns the status of the "Send Metronome" feature
 */
export const sendMetFeatureStatus = createSelector(
  getActiveWalletMtnBalance,
  getIsOnline,
  (mtnBalance, isOnline) =>
    !isOnline ? 'offline' : !utils.hasFunds(mtnBalance) ? 'no-funds' : 'ok'
)

/**
 * Returns the status of the "Buy Metronome" feature
 */
export const buyFeatureStatus = createSelector(
  getAuctionStatus,
  getIsOnline,
  (auctionStatus, isOnline) => {
    const isDepleted =
      auctionStatus &&
      auctionStatus.tokenRemaining &&
      !utils.hasFunds(auctionStatus.tokenRemaining)
    return !isOnline ? 'offline' : isDepleted ? 'depleted' : 'ok'
  }
)

/**
 * Returns the status of the "Converter" feature (both directions)
 */
export const convertFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getIsOnline,
  (ethBalance, isOnline) =>
    !isOnline ? 'offline' : !utils.hasFunds(ethBalance) ? 'no-eth' : 'ok'
)

export const getIsScanningTx = state => state.wallets.isScanningTx
