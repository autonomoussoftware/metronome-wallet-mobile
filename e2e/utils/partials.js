import {
  readTextValue,
  waitExistence,
  fillField,
  waitText,
  tap
} from './helpers'

async function acceptTerms() {
  await waitText('Accept to Continue')
  await tap('accept-terms-chb')
  await tap('accept-license-chb')
  await tap('accept-terms-btn')
}

async function definePassword() {
  await waitText('Define a PIN')
  await fillField('password', '123456')
  await waitText('Please, enter your PIN again.')
  await fillField('passwordAgain', '123456')
}

async function useGeneratedMnemonic() {
  await waitExistence('copy-mnemonic')
  const mnemonic = await readTextValue('mnemonic-label')
  await tap('copied-mnemonic-btn')
  await waitExistence('mnemonicAgain')
  await tap('mnemonicAgain')
  await fillField('mnemonicAgain', mnemonic)
  await tap('copied-mnemonic-btn')
}

async function onboardWithRandomMnemonic() {
  await acceptTerms()
  await definePassword()
  await useGeneratedMnemonic()
  await waitText('Gathering Information...')
}

module.exports = {
  onboardWithRandomMnemonic
}
