import { AmountFields, DisplayValue, GasEditor, Text, View } from '../common'
import withConvertETHtoMETState from '../../shared/hocs/withConvertETHtoMETState'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import React from 'react'

class ConvertETHtoMETForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    ethPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    estimateError: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    ethAmount: PropTypes.string,
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
      navigation.navigate('ConfirmETHtoMET', other)
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
        <AmountFields
          ethPlaceholder={this.props.ethPlaceholder}
          usdPlaceholder={this.props.usdPlaceholder}
          onInputChange={this.props.onInputChange}
          onMaxClick={this.props.onMaxClick}
          ethAmount={this.props.ethAmount}
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
              <DisplayValue value={this.props.rate} post=" ETH/MET" />.
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

export default withConvertETHtoMETState(withNavigation(ConvertETHtoMETForm))
