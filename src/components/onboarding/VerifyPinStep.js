import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { BaseBtn, View, Text } from '../common'
import { errorPropTypes } from '../../utils'
import PinInput from '../common/PinInput'

export default class VerifyPinStep extends React.Component {
  static propTypes = {
    onPasswordSubmit: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    passwordAgain: PropTypes.string,
    errors: errorPropTypes('passwordAgain')
  }

  render() {
    return (
      <View flex={1} align="center" px={2} pb={10} justify="center">
        <Text size="large" weight="semibold" mb={2}>
          Define a PIN
        </Text>
        <View style={styles.bigPlaceholder}>
          <Text size="medium" align="center" px={4} mb={4}>
            Please, enter your PIN again.
          </Text>
        </View>
        <PinInput
          onComplete={() => this.props.onPasswordSubmit({ clearOnError: true })}
          onChange={this.props.onInputChange}
          testID="passwordAgain"
          value={this.props.passwordAgain || ''}
          error={this.props.errors.passwordAgain}
          id="passwordAgain"
        />
        <View style={styles.placeholder} justify="flex-end">
          <BaseBtn
            onPress={() => {
              this.props.onInputChange({ id: 'password', value: '' })
              this.props.onInputChange({ id: 'passwordAgain', value: '' })
            }}
            label="Go back"
            size="medium"
          />
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  placeholder: {
    height: 50
  },
  bigPlaceholder: {
    height: 70
  }
})
