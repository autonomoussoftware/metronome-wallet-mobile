import { TextInput, MenuBtn, View, Text, Btn } from '../common'
import withToolsState from '../../shared/hocs/withToolsState'
import PropTypes from 'prop-types'
import React from 'react'

class Tools extends React.Component {
  static propTypes = {
    isRecoverEnabled: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired,
    validate: PropTypes.func.isRequired,
    mnemonic: PropTypes.string,
    errors: PropTypes.shape({
      mnemonic: PropTypes.string
    }).isRequired
  }

  onRecoverPress = () => {
    const { navigation, validate, ...other } = this.props
    if (validate()) {
      navigation.navigate('ConfirmRecover', other)
    }
  }

  onRescanPress = () => {
    const { navigation, ...other } = this.props
    navigation.navigate('ConfirmRescan', other)
  }

  render() {
    return (
      <View bg="dark" flex={1} py={4} px={2} scroll>
        <Text size="large" weight="bold">
          Recover a Wallet
        </Text>
        <Text mt={2} size="small">
          Enter a valid twelve-word recovery phrase to recover another wallet.
        </Text>
        <Text my={2} color="danger" size="small" weight="semibold">
          This action will replace your current stored seed!
        </Text>
        <TextInput
          keyboardAppearance="dark"
          numberOfLines={3}
          multiline
          onChange={this.props.onInputChange}
          error={this.props.errors.mnemonic}
          value={this.props.mnemonic}
          label="Recovery passphrase"
          id="mnemonic"
        />
        <Btn
          disabled={!this.props.isRecoverEnabled}
          onPress={this.onRecoverPress}
          label="Recover"
          block
          mt={1.5}
        />

        <View bg="light" pt={0.1} my={4} opacity={0.5} />

        <Text size="large" weight="bold">
          Rescan Transactions List
        </Text>
        <Text mt={2} size="small">
          This will clear your local cache and rescan all your wallet
          transactions.
        </Text>
        <Btn
          onPress={this.onRescanPress}
          label="Rescan Transactions"
          block
          mt={3}
        />
      </View>
    )
  }
}

const EnhancedComponent = withToolsState(Tools)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  title: 'Tools',
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
