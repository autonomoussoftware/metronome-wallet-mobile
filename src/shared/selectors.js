import { createSelector } from 'reselect'
import _ from 'lodash'

const hasFunds = (client, val) => val && client.toBN(val).gt(client.toBN(0))

function getTxType(meta, tokenData, transaction, address) {
  if (_.get(meta, 'metronome.auction')) {
    return 'auction'
  } else if (_.get(meta, 'metronome.converter')) {
    return 'converted'
  } else if (
    (!tokenData && transaction.from && transaction.from === address) ||
    (tokenData && tokenData.from && tokenData.from === address) ||
    (tokenData && tokenData.processing && transaction.from === address)
  ) {
    return 'sent'
  } else if (
    (!tokenData && transaction.to && transaction.to === address) ||
    (tokenData && tokenData.to && tokenData.to === address)
  ) {
    return 'received'
  }

  return 'unknown'
}

export const getClient = (_, client) => client

export const getConfig = state => state.config

export const getConnectivity = state => state.connectivity

export const getIsOnline = createSelector(
  getConnectivity,
  connectivityStatus => connectivityStatus.isOnline
)

export const getIsLoggedIn = state => state.session.isLoggedIn

export const isSessionActive = createSelector(getIsLoggedIn, pass => !!pass)

export const getWalletsById = state => state.wallets.byId
export const getActiveWalletId = state => state.wallets.active

export const getActiveWalletData = createSelector(
  getActiveWalletId,
  getWalletsById,
  (activeId, walletsById) => _.get(walletsById, [activeId], null)
)

export const getActiveWalletAddresses = createSelector(
  getActiveWalletData,
  activeWallet =>
    _.get(activeWallet, 'addresses', null)
      ? Object.keys(activeWallet.addresses)
      : null
)

export const getActiveWalletEthBalance = createSelector(
  getActiveWalletAddresses,
  getActiveWalletData,
  (addresses, activeWallet) =>
    activeWallet && addresses && addresses.length > 0
      ? activeWallet.addresses[addresses[0]].balance || null
      : null
)

export const getActiveWalletMtnBalance = createSelector(
  getActiveWalletAddresses,
  getActiveWalletData,
  getConfig,
  (addresses, activeWallet, config) =>
    activeWallet && addresses && addresses.length > 0
      ? _.get(
          activeWallet,
          [
            'addresses',
            addresses[0],
            'token',
            config.MTN_TOKEN_ADDR,
            'balance'
          ],
          null
        )
      : null
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
  (_, client) => client,
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
  (_, client) => client,
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
  (_, client) => client,
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

export const getTxConfirmations = createSelector(
  getBlockHeight,
  (state, props) => props.transaction.blockNumber,
  (blockHeight, txBlockNumber) =>
    txBlockNumber === null || txBlockNumber > blockHeight
      ? 0
      : blockHeight - txBlockNumber + 1
)

export const getActiveWalletTransactions = createSelector(
  getActiveWalletAddresses,
  getActiveWalletData,
  getClient,
  (addresses, activeWallet, client) => {
    const txs =
      activeWallet && addresses && addresses.length > 0
        ? activeWallet.addresses[addresses[0]].transactions || []
        : []

    function parseTx({ transaction, receipt, meta }) {
      const tokenData = Object.values(meta.tokens || {})[0] || null

      const isProcessing = tokenData && tokenData.processing

      const myAddress =
        activeWallet && addresses && addresses.length > 0 ? addresses[0] : ''

      const txType = getTxType(meta, tokenData, transaction, myAddress)

      const from =
        txType === 'received' && tokenData && tokenData.from
          ? tokenData.from
          : transaction.from
            ? transaction.from
            : null

      const to =
        txType === 'sent' && tokenData && tokenData.to
          ? tokenData.to
          : transaction.to
            ? transaction.to
            : null

      const value =
        ['received', 'sent'].includes(txType) && tokenData && tokenData.value
          ? tokenData.value
          : transaction.value

      const ethSpentInAuction =
        txType === 'auction' && meta
          ? client
              .toBN(transaction.value)
              .sub(client.toBN(meta.returnedValue))
              .toString(10)
          : null

      const mtnBoughtInAuction =
        txType === 'auction' && transaction.blockHash && tokenData
          ? tokenData.value
          : null

      const symbol = ['received', 'sent'].includes(txType)
        ? tokenData
          ? 'MET'
          : 'ETH'
        : null

      const contractCallFailed = meta.contractCallFailed || false

      const convertedFrom =
        txType === 'converted'
          ? client.toBN(transaction.value).isZero()
            ? 'MET'
            : 'ETH'
          : null

      const fromValue = convertedFrom
        ? convertedFrom === 'ETH'
          ? transaction.value
          : tokenData
            ? tokenData.value
            : null
        : null

      const toValue =
        convertedFrom && tokenData && meta
          ? convertedFrom === 'ETH'
            ? tokenData.value
            : meta.returnedValue
          : null

      const isApproval =
        !!tokenData &&
        tokenData.event === 'Approval' &&
        !client.toBN(tokenData.value).isZero()

      const isCancelApproval =
        !!tokenData &&
        tokenData.event === 'Approval' &&
        client.toBN(tokenData.value).isZero()

      const approvedValue =
        tokenData && tokenData.event === 'Approval' ? tokenData.value : null

      return {
        transaction,
        receipt,
        meta,
        parsed: {
          mtnBoughtInAuction,
          contractCallFailed,
          ethSpentInAuction,
          isCancelApproval,
          convertedFrom,
          approvedValue,
          isProcessing,
          isApproval,
          fromValue,
          toValue,
          txType,
          symbol,
          value,
          from,
          to
        }
      }
    }

    return _.sortBy(txs, [
      'transaction.blockNumber',
      'transaction.transactionIndex'
    ])
      .reverse()
      .map(parseTx)
  }
)

export const hasEnoughData = state => state.session.hasEnoughData

export const sendFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getActiveWalletMtnBalance,
  getIsOnline,
  getClient,
  (ethBalance, mtnBalance, isOnline, client) => {
    return !isOnline
      ? 'offline'
      : !hasFunds(client, ethBalance) && !hasFunds(client, mtnBalance)
        ? 'no-funds'
        : 'ok'
  }
)

export const sendMetFeatureStatus = createSelector(
  getActiveWalletMtnBalance,
  getIsOnline,
  getClient,
  (mtnBalance, isOnline, client) => {
    const hasFunds = val => val && client.toBN(val).gt(client.toBN(0))
    return !isOnline ? 'offline' : !hasFunds(mtnBalance) ? 'no-funds' : 'ok'
  }
)

export const buyFeatureStatus = createSelector(
  getAuctionStatus,
  getIsOnline,
  getClient,
  (auctionStatus, isOnline, client) => {
    const isDepleted =
      auctionStatus &&
      auctionStatus.tokenRemaining &&
      !client.toBN(auctionStatus.tokenRemaining).gt(client.toBN(0))
    return !isOnline ? 'offline' : isDepleted ? 'depleted' : 'ok'
  }
)

export const convertFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getIsOnline,
  getClient,
  (ethBalance, isOnline, client) => {
    return !isOnline
      ? 'offline'
      : !hasFunds(client, ethBalance)
        ? 'no-eth'
        : 'ok'
  }
)

// Returns the conversion from ETH status. Useful for disabling "ETH -> MET" tab
export const convertEthFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getClient,
  (ethBalance, client) => {
    return hasFunds(client, ethBalance) ? 'ok' : 'no-eth'
  }
)

// Returns the conversion from MET status. Useful for disabling "MET -> ETH" tab
export const convertMetFeatureStatus = createSelector(
  getActiveWalletEthBalance,
  getActiveWalletMtnBalance,
  getClient,
  (ethBalance, metBalance, client) => {
    return !hasFunds(client, ethBalance)
      ? 'no-eth'
      : !hasFunds(client, metBalance)
        ? 'no-met'
        : 'ok'
  }
)

export const getIsScanningTx = state => state.wallets.isScanningTx
