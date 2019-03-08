import { validatePIN, setPIN } from '../auth'
import { mnemonicToSeedHex } from '../keys'
import noCore from './no-core'
import singleCore from './single-core'

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
  validatePIN(password).then(cores.forEach(singleCore.openWallet))

export default {
  onOnboardingCompleted,
  recoverFromMnemonic,
  onLoginSubmit
}
