import { View, Text, TextInput, Btn } from './common'
import { errorPropTypes } from '../utils'
import withLoginState from '../shared/hocs/withLoginState'
import PropTypes from 'prop-types'
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
    const { onInputChange, onSubmit, password, errors, error } = this.props

    return (
      <View bg="dark" flex={1}>
        <RN.StatusBar barStyle="light-content" />
        <RN.ImageBackground
          source={require('../assets/images/pattern.png')}
          style={styles.bg}
        >
          <View flex={1} justify="center" align="center" p={2}>
            <Text size="large" mb={2}>
              Enter your password
            </Text>
            <TextInput
              onChange={onInputChange}
              error={errors.password}
              value={password}
              label="Password"
              id="password"
            />
            <Btn
              disabled={this.props.status === 'pending'}
              onPress={onSubmit}
              label="Send"
              block
              mt={4}
            />
            {error && (
              <Text color="danger" mt={2}>
                {error}
              </Text>
            )}
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
