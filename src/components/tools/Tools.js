import { TextInput, MenuBtn, View, Text, Btn } from '../common'
import withRecoverFromMnemonicState from '../../shared/hocs/withRecoverFromMnemonicState'
import PropTypes from 'prop-types'
import React from 'react'

class Tools extends React.Component {
  static propTypes = {
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

  onRecoverClick = () => {
    const { navigation, validate, ...other } = this.props
    if (validate()) {
      navigation.navigate('ConfirmRecover', other)
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} py={4} px={2}>
        <Text size="medium">Enter the 12 words to recover your wallet.</Text>
        <Text my={4} color="danger" size="small" weight="semibold">
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
        <Btn onPress={this.onRecoverClick} label="Recover" block mt={2} />
      </View>
    )
  }
}

const EnhancedComponent = withRecoverFromMnemonicState(Tools)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  title: 'Tools',
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
