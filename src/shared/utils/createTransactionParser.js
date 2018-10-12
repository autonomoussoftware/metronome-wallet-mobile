import BigNumber from 'bignumber.js'
import _ from 'lodash'

function isAuctionTransaction(rawTx) {
  return _.get(rawTx.meta, 'metronome.auction', false)
}

function isConversionTransaction(rawTx) {
  return _.get(rawTx.meta, 'metronome.converter', false)
}

function isSendTransaction({ transaction }, tokenData, myAddress) {
  return (
    (!tokenData && transaction.from && transaction.from === myAddress) ||
    (tokenData && tokenData.from && tokenData.from === myAddress) ||
    (tokenData && tokenData.processing && transaction.from === myAddress)
  )
}

function isReceiveTransaction({ transaction }, tokenData, myAddress) {
  return (
    (!tokenData && transaction.to && transaction.to === myAddress) ||
    (tokenData && tokenData.to && tokenData.to === myAddress)
  )
}

function getTxType(rawTx, tokenData, myAddress) {
  if (isAuctionTransaction(rawTx)) return 'auction'
  if (isConversionTransaction(rawTx)) return 'converted'
  if (isSendTransaction(rawTx, tokenData, myAddress)) return 'sent'
  if (isReceiveTransaction(rawTx, tokenData, myAddress)) return 'received'
  return 'unknown'
}

function getFrom(rawTx, tokenData, txType) {
  return txType === 'received' && tokenData && tokenData.from
    ? tokenData.from
    : rawTx.transaction.from
      ? rawTx.transaction.from
      : null
}

function getTo(rawTx, tokenData, txType) {
  return txType === 'sent' && tokenData && tokenData.to
    ? tokenData.to
    : rawTx.transaction.to
      ? rawTx.transaction.to
      : null
}

function getValue(rawTx, tokenData, txType) {
  return ['received', 'sent'].includes(txType) && tokenData && tokenData.value
    ? tokenData.value
    : rawTx.transaction.value
}

function getEthSpentInAuction(rawTx, txType) {
  return txType === 'auction' && rawTx.meta
    ? new BigNumber(rawTx.transaction.value)
        .minus(new BigNumber(rawTx.meta.returnedValue))
        .toString(10)
    : null
}

function getMetBoughtInAuction(rawTx, tokenData, txType) {
  return txType === 'auction' && rawTx.transaction.blockHash && tokenData
    ? tokenData.value
    : null
}

function getSymbol(tokenData, txType) {
  return ['received', 'sent'].includes(txType)
    ? tokenData
      ? 'MET'
      : 'ETH'
    : null
}

function getConvertedFrom(rawTx, txType) {
  return txType === 'converted'
    ? new BigNumber(rawTx.transaction.value).isZero()
      ? 'MET'
      : 'ETH'
    : null
}

function getFromValue(rawTx, tokenData, convertedFrom) {
  return convertedFrom
    ? convertedFrom === 'ETH'
      ? rawTx.transaction.value
      : tokenData
        ? tokenData.value
        : null
    : null
}

function getToValue(rawTx, tokenData, convertedFrom) {
  return convertedFrom && tokenData && rawTx.meta
    ? convertedFrom === 'ETH'
      ? tokenData.value
      : rawTx.meta.returnedValue
    : null
}

function getIsApproval(tokenData) {
  return (
    !!tokenData &&
    tokenData.event === 'Approval' &&
    !new BigNumber(tokenData.value).isZero()
  )
}

function getIsCancelApproval(tokenData) {
  return (
    !!tokenData &&
    tokenData.event === 'Approval' &&
    new BigNumber(tokenData.value).isZero()
  )
}

function getApprovedValue(tokenData) {
  return tokenData && tokenData.event === 'Approval' ? tokenData.value : null
}

function getIsProcessing(tokenData) {
  return _.get(tokenData, 'processing', false)
}

function getContractCallFailed(rawTx) {
  return _.get(rawTx, ['meta', 'contractCallFailed'], false)
}

function getGasUsed(rawTx) {
  return _.get(rawTx, ['receipt', 'gasUsed'], null)
}

function getTransactionHash(rawTx) {
  return _.get(rawTx, ['transaction', 'hash'], null)
}

function getBlockNumber(rawTx) {
  return _.get(rawTx, ['transaction', 'blockNumber'], null)
}

export const createTransactionParser = myAddress => rawTx => {
  const tokenData = Object.values(rawTx.meta.tokens || {})[0] || null
  const txType = getTxType(rawTx, tokenData, myAddress)
  const convertedFrom = getConvertedFrom(rawTx, txType)

  return {
    mtnBoughtInAuction: getMetBoughtInAuction(rawTx, tokenData, txType),
    contractCallFailed: getContractCallFailed(rawTx),
    ethSpentInAuction: getEthSpentInAuction(rawTx, txType),
    isCancelApproval: getIsCancelApproval(tokenData),
    approvedValue: getApprovedValue(tokenData),
    convertedFrom,
    isProcessing: getIsProcessing(tokenData),
    blockNumber: getBlockNumber(rawTx),
    isApproval: getIsApproval(tokenData),
    fromValue: getFromValue(rawTx, tokenData, convertedFrom),
    toValue: getToValue(rawTx, tokenData, convertedFrom),
    gasUsed: getGasUsed(rawTx),
    txType,
    symbol: getSymbol(tokenData, txType),
    value: getValue(rawTx, tokenData, txType),
    from: getFrom(rawTx, tokenData, txType),
    hash: getTransactionHash(rawTx),
    to: getTo(rawTx, tokenData, txType)
  }
}
