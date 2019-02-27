import withConvertCoinToMETState from 'metronome-wallet-ui-logic/src/hocs/withConvertCoinToMETState'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { AmountFields, DisplayValue, GasEditor, Text, View } from '../common'

class ConvertCoinToMETForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    coinPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    estimateError: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    coinSymbol: PropTypes.string.isRequired,
    coinAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    estimate: PropTypes.string,
    errors: PropTypes.object.isRequired,
    rate: PropTypes.string
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onHeaderRightPress: this.onHeaderRightPress
    })
  }

  onHeaderRightPress = () => {
    const { navigation, validate, ...other } = this.props
    if (validate()) {
      RN.Keyboard.dismiss()
      navigation.navigate('ConfirmCoinToMET', other)
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
        <AmountFields
          coinPlaceholder={this.props.coinPlaceholder}
          usdPlaceholder={this.props.usdPlaceholder}
          onInputChange={this.props.onInputChange}
          onMaxClick={this.props.onMaxClick}
          coinSymbol={this.props.coinSymbol}
          coinAmount={this.props.coinAmount}
          usdAmount={this.props.usdAmount}
          autoFocus
          errors={this.props.errors}
        />

        <View grow={1} mt={2}>
          <GasEditor
            gasEstimateError={this.props.gasEstimateError}
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
          {this.props.estimate && (
            <Text size="small" mt={2}>
              You would get approximately{' '}
              <DisplayValue
                value={this.props.estimate}
                color="primary"
                post=" MET"
              />
              , which means a rate of{' '}
              <DisplayValue
                value={this.props.rate}
                post={` ${this.props.coinSymbol}/MET`}
              />
              .
            </Text>
          )}
          {this.props.estimateError && (
            <Text color="danger" mt={1}>
              Error getting conversion estimate: {this.props.estimateError}
            </Text>
          )}
        </View>
      </View>
    )
  }
}

export default withConvertCoinToMETState(withNavigation(ConvertCoinToMETForm))
