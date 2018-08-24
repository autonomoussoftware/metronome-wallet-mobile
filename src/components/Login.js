import { errorPropTypes } from '../utils'
import { PinInput, View } from './common'
import withLoginState from '../shared/hocs/withLoginState'
import PropTypes from 'prop-types'
import Banner from './icons/Banner'
import React from 'react'
import RN from 'react-native'

class Login extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    password: PropTypes.string,
    status: PropTypes.oneOf(['init', 'pending', 'success', 'failure'])
      .isRequired,
    errors: errorPropTypes('password'),
    error: PropTypes.string
  }

  render() {
    const { onInputChange, onSubmit, password, error } = this.props

    return (
      <View bg="dark" flex={1}>
        <RN.StatusBar barStyle="light-content" />
        <RN.ImageBackground
          source={require('../assets/images/pattern.png')}
          style={styles.bg}
        >
          <RN.KeyboardAvoidingView behavior="height" style={styles.bg}>
            <View justify="center" align="center" flex={1}>
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
          </RN.KeyboardAvoidingView>
        </RN.ImageBackground>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  bg: {
    flex: 1
  }
})

export default withLoginState(Login)
