import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { BaseBtn, View, Text, Btn } from '../common'

export default class CopyMnemonicStep extends React.Component {
  static propTypes = {
    onUseUserMnemonicToggled: PropTypes.func.isRequired,
    onMnemonicCopiedToggled: PropTypes.func.isRequired,
    mnemonic: PropTypes.string
  }

  render() {
    return (
      <View justify="center" align="center" flex={1} p={2}>
        <Text size="large" weight="semibold" mb={2}>
          Recovery Passphrase
        </Text>
        <Text size="medium" mb={4} align="center">
          Copy the following word list and keep it in a safe place. You will
          need these to recover your wallet in the future —don’t lose it.
        </Text>
        {this.props.mnemonic ? (
          <RN.TouchableWithoutFeedback
            onPress={() => RN.Clipboard.setString(this.props.mnemonic)}
          >
            <View row rowwrap justify="space-evenly">
              {this.props.mnemonic.split(' ').map((word, i) => (
                <Text
                  weight="bold"
                  color="primary"
                  size="large"
                  key={`${word}-${i}`}
                  ls={0.5}
                  m={1}
                >
                  {word}
                </Text>
              ))}
            </View>
          </RN.TouchableWithoutFeedback>
        ) : (
          <RN.ActivityIndicator />
        )}
        <Btn
          onPress={this.props.onMnemonicCopiedToggled}
          label="I've copied it"
          block
          mt={6}
          mb={3}
        />
        <BaseBtn
          onPress={this.props.onUseUserMnemonicToggled}
          label="Or recover from a saved passphrase"
          block
        />
      </View>
    )
  }
}
