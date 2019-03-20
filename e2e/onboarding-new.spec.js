const { onboardWithRandomMnemonic } = require('./utils/partials')
const { waitText, fillField } = require('./utils/helpers')

it('Onboards a new user with generated mnemonic', async function() {
  await device.disableSynchronization()
  await device.launchApp({ delete: true })
  await onboardWithRandomMnemonic()
  await device.reloadReactNative()
  await waitText('Enter your PIN')
  await fillField('password', '123456')
  await waitText('Gathering Information...')
})
