import withGasEditorState from '../../shared/hocs/withGasEditorState';
import { errorPropTypes } from '../../utils';
import TextInput from './TextInput';
import PropTypes from 'prop-types';
import BaseBtn from './BaseBtn';
import React from 'react';
import View from './View';
import Text from './Text';

class GasEditor extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onGasToggle: PropTypes.func.isRequired,
    gasPrice: PropTypes.string.isRequired,
    gasLimit: PropTypes.string.isRequired,
    errors: errorPropTypes('gasPrice', 'gasLimit')
  };

  render() {
    return this.props.useCustomGas ? (
      <View row align="center">
        <View grow={1} basis={0}>
          <TextInput
            onChange={this.props.onInputChange}
            label="Gas Limit (Units)"
            error={this.props.errors.gasLimit}
            value={this.props.gasLimit}
            id="gasLimit"
          />
        </View>
        <View mt={2} mx={1}>
          <Text opacity={0}>&larr;</Text>
          <Text opacity={0}>&rarr;</Text>
        </View>
        <View grow={1} basis={0}>
          <TextInput
            onChange={this.props.onInputChange}
            value={this.props.gasPrice}
            label="Gas Price (Gwei)"
            error={this.props.errors.gasPrice}
            id="gasPrice"
          />
        </View>
      </View>
    ) : (
      <View justify="space-between" align="baseline" row py={1}>
        <View row rowwrap shrink={1}>
          <Text opacity={0.75} mr={2} mb={1}>
            Gas Limit: {this.props.gasLimit} (Units)
          </Text>
          <Text opacity={0.75} mr={2}>
            Gas Price: {this.props.gasPrice} (Gwei)
          </Text>
        </View>
        <BaseBtn label="EDIT GAS" onPress={this.props.onGasToggle} />
      </View>
    );
  }
}

export default withGasEditorState(GasEditor);
