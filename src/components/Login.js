import { errorPropTypes } from '../utils'
import withLoginState from '../shared/hocs/withLoginState'
import { View, Text } from './common'
import PinWithNumpad from './common/PinWithNumpad'
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
          <View flex={1} justify="center" align="center" p={2}>
            <Banner width="220" />
            <Text size="medium" weight="semibold" mt={4} mb={2}>
              Enter your PIN
            </Text>
            <PinWithNumpad
              shakeOnError
              onComplete={onSubmit}
              disabled={this.props.status === 'pending'}
              onChange={onInputChange}
              value={password || ''}
              error={error}
              id="password"
            />
          </View>
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
