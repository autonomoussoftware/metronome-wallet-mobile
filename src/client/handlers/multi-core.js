import { validatePIN, setPIN } from '../auth'
import { mnemonicToSeedHex } from '../keys'
import noCore from './no-core'
import singleCore from './single-core'
import { findCoreByChainName, findCoreBySymbol } from './utils'
import config from '../../config'
import { flatten } from 'lodash'

const createWallets = (data, cores, openWallets = true) =>
  Promise.all([
    cores.forEach(core =>
      singleCore
        .createWallet(data, core)
        .then(() => openWallets && singleCore.openWallet(core))
    )
  ])

const onOnboardingCompleted = ({ mnemonic, password }, cores) =>
  setPIN(password).then(() =>
    createWallets(
      {
        seed: mnemonicToSeedHex(mnemonic),
        password
      },
      cores
    )
  )

const recoverFromMnemonic = ({ mnemonic, password }, cores) =>
  validatePIN(password)
    .then(
      createWallets(
        { seed: mnemonicToSeedHex(mnemonic), password },
        cores,
        false
      )
    )
    .then(noCore.clearCache)

const onLoginSubmit = ({ password }, cores) =>
  validatePIN(password).then(() => cores.forEach(singleCore.openWallet))

const getPortFees = (data, cores) => {
  const exportCore = findCoreByChainName(cores, data.chain)
  return singleCore
    .getExportMetFee(data, exportCore)
    .then(fee =>
      singleCore
        .getExportGasLimit({ ...data, fee }, exportCore)
        .then(({ gasLimit }) => ({ exportGasLimit: gasLimit, fee }))
    )
}

const withMerkleRoot = fn => (data, cores) => {
  const exportCore = findCoreBySymbol(cores, data.originChain)
  const importCore = findCoreByChainName(cores, data.chain)
  return singleCore.getMerkleRoot(data.burnSequence, exportCore).then(root => {
    const importData = { ...data, root }
    return fn(importData, importCore)
  })
}

const importMetronome = (data, cores) =>
  withMerkleRoot(singleCore.importMetronome)(data, cores)

const getImportMetGas = (data, cores) =>
  withMerkleRoot(singleCore.getImportGasLimit)(data, cores)

const portMetronome = (data, cores) => {
  const exportCore = findCoreByChainName(cores, data.chain)
  const exportData = {
    ...data,
    destinationChain: config.chains[data.destinationChain].symbol,
    destinationMetAddress: config.chains[data.destinationChain].metTokenAddress,
    extraData: '0x00'
  }
  return singleCore
    .exportMetronome(exportData, exportCore)
    .then(({ receipt }) => {
      const parsedExportReceipt = flatten(
        Object.keys(receipt.events)
          .filter(e => !receipt.events[e].event) // Filter already parsed event keys
          .map(e => receipt.events[e]) // Get not parsed events
          .map(e => exportCore.coreApi.explorer.tryParseEventLog(e)) // Try to parse each event
      ).find(e => e.parsed.event === 'LogExportReceipt') // Get LogExportReceipt event
      if (!parsedExportReceipt || !parsedExportReceipt.parsed) {
        return Promise.reject(
          new Error('There was an error trying to parse export receipt')
        )
      }
      const { returnValues } = parsedExportReceipt.parsed
      const importCore = findCoreByChainName(cores, data.destinationChain)
      const importData = {
        blockTimestamp: returnValues.blockTimestamp,
        burnSequence: returnValues.burnSequence,
        currentBurnHash: returnValues.currentBurnHash,
        currentTick: returnValues.currentTick,
        dailyMintable: returnValues.dailyMintable,
        destinationChain: config.chains[data.destinationChain].symbol,
        destinationMetAddress: returnValues.destinationMetronomeAddr,
        extraData: returnValues.extraData,
        fee: returnValues.fee,
        from: data.from,
        originChain: config.chains[data.chain].symbol,
        previousBurnHash: returnValues.prevBurnHash,
        supply: returnValues.supplyOnAllChains,
        value: returnValues.amountToBurn,
        password: data.password,
        walletId: data.walletId
      }
      return singleCore
        .getMerkleRoot(returnValues.burnSequence, exportCore)
        .then(root => {
          // Object.assign(importData, { root })
          importData.root = root
          return singleCore
            .getImportGasLimit(importData, importCore)
            .then(({ gasLimit }) =>
              singleCore.importMetronome(
                { ...importData, gas: gasLimit },
                importCore
              )
            )
        })
    })
}
export default {
  retryImport: importMetronome,
  onOnboardingCompleted,
  recoverFromMnemonic,
  importMetronome,
  getImportMetGas,
  portMetronome,
  onLoginSubmit,
  getPortFees
}
