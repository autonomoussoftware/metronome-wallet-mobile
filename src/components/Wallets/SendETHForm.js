import { AmountFields, GasEditor, TextInput, View, Btn } from '../common'
import { pageStatusPropTypes } from '../../utils'
import withSendETHFormState from '../../shared/hocs/withSendETHFormState'
import PropTypes from 'prop-types'
import React from 'react'

class SendETHForm extends React.Component {
  static propTypes = {
    ethPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    availableETH: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    ethAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    errors: PropTypes.object.isRequired,
    ...pageStatusPropTypes
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.pageStatus === 'offscreen' &&
      prevProps.pageStatus !== 'offscreen'
    ) {
      this.props.resetForm()
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} px={2} pt={3} pb={4}>
        <View grow={1}>
          <TextInput
            placeholder="e.g. 0x2345678998765434567"
            onChange={this.props.onInputChange}
            error={this.props.errors.toAddress}
            label="Send to Address"
            value={this.props.toAddress}
            id="toAddress"
          />
          <View my={3}>
            <AmountFields
              ethPlaceholder={this.props.ethPlaceholder}
              usdPlaceholder={this.props.usdPlaceholder}
              onInputChange={this.props.onInputChange}
              onMaxClick={this.props.onMaxClick}
              ethAmount={this.props.ethAmount}
              usdAmount={this.props.usdAmount}
              errors={this.props.errors}
            />
          </View>
          <GasEditor
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
        </View>
        <Btn label="Review Send" mt={3} />
      </View>
    )
  }
}

export default withSendETHFormState(SendETHForm)
