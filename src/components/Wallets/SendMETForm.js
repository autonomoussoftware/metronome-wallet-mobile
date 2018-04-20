import { GasEditor, TextInput, View, Btn, BaseBtn } from '../common'
import { pageStatusPropTypes } from '../../utils'
import withSendMETFormState from '../../shared/hocs/withSendMETFormState'
import PropTypes from 'prop-types'
import React from 'react'

class SendMETForm extends React.Component {
  static propTypes = {
    metPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    availableMET: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    metAmount: PropTypes.string,
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
            <TextInput
              placeholder={this.props.metPlaceholder}
              postLabel={
                <BaseBtn
                  textProps={{ opacity: 0.75 }}
                  onPress={this.props.onMaxClick}
                  label="MAX"
                  size="small"
                />
              }
              onChange={this.props.onInputChange}
              error={this.props.errors.metAmount}
              label="Amount (MET)"
              value={this.props.metAmount}
              id="metAmount"
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

export default withSendMETFormState(SendMETForm)
