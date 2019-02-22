import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { MnemonicInput, BaseBtn, View, Text, Btn } from '../common'
import { errorPropTypes } from '../../utils'

export default class UserMnemonicStep extends React.Component {
  static propTypes = {
    onUseUserMnemonicToggled: PropTypes.func.isRequired,
    onMnemonicAccepted: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    userMnemonic: PropTypes.string,
    errors: errorPropTypes('userMnemonic')
  }

  render() {
    return (
      <View pt={RN.Platform.OS === 'ios' ? 3 : 0} flex={1}>
        <View
          withKeyboard
          scrollProps={{
            keyboardShouldPersistTaps: 'handled'
          }}
          justify="center"
          align="center"
          flex={1}
          px={2}
          py={3}
          mt={3}
        >
          <Text size="large" weight="semibold" mb={2}>
            Recovery Passphrase
          </Text>
          <Text size="medium" mb={4} align="center">
            Enter a valid 12 word passphrase to recover a previously created
            wallet.
          </Text>
          <MnemonicInput
            onChange={this.props.onInputChange}
            error={this.props.errors.userMnemonic}
            value={this.props.userMnemonic}
            label="Recovery passphrase"
            id="userMnemonic"
          />
          <Btn
            onPress={this.props.onMnemonicAccepted}
            label="Recover"
            block
            mt={2}
            mb={4}
          />
          <BaseBtn
            onPress={this.props.onUseUserMnemonicToggled}
            label="Go back"
            block
          />
        </View>
      </View>
    )
  }
}
