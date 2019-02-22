import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { MnemonicInput, BaseBtn, View, Text, Btn } from '../common'
import { errorPropTypes } from '../../utils'

export default class VerifyMnemonicStep extends React.Component {
  static propTypes = {
    onMnemonicCopiedToggled: PropTypes.func.isRequired,
    onMnemonicAccepted: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    mnemonicAgain: PropTypes.string,
    errors: errorPropTypes('mnemonicAgain')
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
            To verify you have copied the recovery passphrase correctly, enter
            the 12 words provided before in the field below.
          </Text>
          <MnemonicInput
            onChange={this.props.onInputChange}
            error={this.props.errors.mnemonicAgain}
            value={this.props.mnemonicAgain}
            label="Recovery passphrase"
            id="mnemonicAgain"
          />
          <Btn
            onPress={this.props.onMnemonicAccepted}
            label="Done"
            block
            mt={2}
            mb={4}
          />
          <BaseBtn
            onPress={this.props.onMnemonicCopiedToggled}
            label="Go back"
            block
          />
        </View>
      </View>
    )
  }
}
