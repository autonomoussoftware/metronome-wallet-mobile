import withBuyMETFormState from 'metronome-wallet-ui-logic/src/hocs/withBuyMETFormState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import {
  AmountFields,
  DisplayValue,
  GasEditor,
  BaseBtn,
  View,
  Text
} from '../common'

class BuyMETForm extends React.Component {
  static propTypes = {
    expectedMETamount: PropTypes.string,
    gasEstimateError: PropTypes.bool,
    excessCoinAmount: PropTypes.string,
    coinPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    tokenRemaining: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    usedCoinAmount: PropTypes.string,
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
    excedes: PropTypes.bool,
    errors: PropTypes.object.isRequired
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
      navigation.navigate('ConfirmPurchase', other)
    }
  }

  render() {
    return (
      <View withKeyboard withHeader bg="dark">
        <View flex={1} px={2} py={4} grow={1}>
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

          <View grow={1} mt={4}>
            <GasEditor
              gasEstimateError={this.props.gasEstimateError}
              onInputChange={this.props.onInputChange}
              useCustomGas={this.props.useCustomGas}
              gasLimit={this.props.gasLimit}
              gasPrice={this.props.gasPrice}
              errors={this.props.errors}
            />

            {this.props.expectedMETamount && (
              <View mt={4}>
                {this.props.excedes ? (
                  <Text color="danger" size="medium">
                    You would get all remaining{' '}
                    <DisplayValue
                      value={this.props.tokenRemaining}
                      color="danger"
                      post=" MET"
                    />{' '}
                    and receive a return of approximately{' '}
                    <DisplayValue
                      value={this.props.excessCoinAmount}
                      color="danger"
                      post={` ${this.props.coinSymbol}`}
                    />
                    .
                  </Text>
                ) : (
                  <Text size="medium">
                    You would get approximately{' '}
                    <DisplayValue
                      value={this.props.expectedMETamount}
                      post=" MET"
                    />
                    .
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withBuyMETFormState(BuyMETForm)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Buy Metronome',
  headerBackTitle: null,
  headerRight: (
    <BaseBtn
      textProps={{ weight: 'semibold', size: 'medium' }}
      onPress={navigation.getParam('onHeaderRightPress', null)}
      label="Review"
      mr={1}
    />
  )
})

export default EnhancedComponent
