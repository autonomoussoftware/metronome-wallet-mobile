import withConvertMETtoETHState from '../../shared/hocs/withConvertMETtoETHState'
import { withNavigation } from 'react-navigation'
import { errorPropTypes } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'
import {
  DisplayValue,
  TextInput,
  GasEditor,
  BaseBtn,
  Text,
  View
} from '../common'

class ConvertMETtoETHForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    metPlaceholder: PropTypes.string,
    estimateError: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    metAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    estimate: PropTypes.string,
    errors: errorPropTypes('metAmount'),
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
      navigation.navigate('ConfirmMETtoETH', other)
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
        <TextInput
          keyboardType="decimal-pad"
          placeholder={this.props.metPlaceholder}
          postLabel={
            <BaseBtn
              textProps={{ opacity: 0.8, weight: 'semibold' }}
              onPress={this.props.onMaxClick}
              label="MAX"
              size="xSmall"
            />
          }
          autoFocus
          onChange={this.props.onInputChange}
          error={this.props.errors.metAmount}
          label="Amount (MET)"
          value={this.props.metAmount}
          id="metAmount"
        />
        <View grow={1} mt={2}>
          <GasEditor
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
                post=" ETH"
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

export default withConvertMETtoETHState(withNavigation(ConvertMETtoETHForm))
