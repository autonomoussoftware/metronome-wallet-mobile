import { AmountFields, GasEditor, Btn, View } from '../common'
import withConvertETHtoMETState from '../../shared/hocs/withConvertETHtoMETState'
import { pageStatusPropTypes } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'

class ConvertETHtoMETForm extends React.Component {
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
      <View flex={1} px={2} py={4} justify="space-between">
        <AmountFields
          ethPlaceholder={this.props.ethPlaceholder}
          usdPlaceholder={this.props.usdPlaceholder}
          onInputChange={this.props.onInputChange}
          onMaxClick={this.props.onMaxClick}
          ethAmount={this.props.ethAmount}
          usdAmount={this.props.usdAmount}
          errors={this.props.errors}
        />
        <View grow={1} mt={4}>
          <GasEditor
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
        </View>
        <Btn label="Review Convert" mt={4} />
      </View>
    )
  }
}

export default withConvertETHtoMETState(ConvertETHtoMETForm)
