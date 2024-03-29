import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

export default class WipeStorage extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  resetStorage = () => {
    RN.Alert.alert(
      'WARNING',
      'This will remove all data. Do you want to continue?',
      [
        {text: 'NO', onPress: () => {}, style: 'cancel'},
        {
          text: 'YES',
          onPress: () =>
            Promise.all([
              AsyncStorage.clear(),
              Keychain.resetInternetCredentials('wallet.seed'),
              Keychain.resetInternetCredentials('wallet.pin')
            ]).then(() => RNRestart.Restart())
        }
      ]
    )
  }

  render() {
    return (
      <RN.TouchableOpacity disabled={!__DEV__} onPress={this.resetStorage}>
        {this.props.children}
      </RN.TouchableOpacity>
    )
  }
}
