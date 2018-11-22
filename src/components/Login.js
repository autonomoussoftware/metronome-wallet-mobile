import withLoginState from 'metronome-wallet-ui-logic/src/hocs/withLoginState'
import PropTypes from 'prop-types'
import React from 'react'

import { PatternView, PinInput, View } from './common'
import Banner from './icons/Banner'

class Login extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    password: PropTypes.string,
    error: PropTypes.string
  }

  render() {
    const { onInputChange, onSubmit, password, error } = this.props

    return (
      <PatternView>
        <View withKeyboard justify="center" align="center" flex={1}>
          <View mb={6}>
            <Banner width="220" />
          </View>

          <PinInput
            shakeOnError
            onComplete={onSubmit}
            onChange={onInputChange}
            label="Enter your PIN"
            value={password || ''}
            error={error}
            id="password"
          />
        </View>
      </PatternView>
    )
  }
}

export default withLoginState(Login)
