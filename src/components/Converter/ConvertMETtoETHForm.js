import { TextInput, GasEditor, BaseBtn, Btn, View } from '../common';
import { errorPropTypes, pageStatusPropTypes } from '../../utils';
import withConvertMETtoETHState from '../../shared/hocs/withConvertMETtoETHState';
import PropTypes from 'prop-types';
import React from 'react';

class ConvertMETtoETHForm extends React.Component {
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
    errors: errorPropTypes('metAmount'),
    ...pageStatusPropTypes
  };

  componentDidUpdate(prevProps) {
    if (this.props.status === 'offscreen' && prevProps.status !== 'offscreen') {
      this.props.resetForm();
    }
  }

  render() {
    return (
      <View flex={1} px={2} py={4} justify="space-between">
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
    );
  }
}

export default withConvertMETtoETHState(ConvertMETtoETHForm);
