import withGasEditorState from 'metronome-wallet-ui-logic/src/hocs/withGasEditorState'
import PropTypes from 'prop-types'
import React from 'react'

import { errorPropTypes } from '../../utils'
import TextInput from './TextInput'
import BaseBtn from './BaseBtn'
import View from './View'
import Text from './Text'

class GasEditor extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onGasToggle: PropTypes.func.isRequired,
    priceError: PropTypes.bool,
    gasPrice: PropTypes.string.isRequired,
    gasLimit: PropTypes.string.isRequired,
    errors: errorPropTypes('gasPrice', 'gasLimit')
  }

  render() {
    return (
      <View>
        {this.props.useCustomGas ? (
          <View row align="center">
            <View grow={1} basis={0}>
              <TextInput
                keyboardType="number-pad"
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
                keyboardType="decimal-pad"
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
            <BaseBtn
              textProps={{ opacity: 0.8 }}
              onPress={this.props.onGasToggle}
              label="EDIT GAS"
              size="xSmall"
            />
          </View>
        )}
        {this.props.priceError && (
          <Text opacity={0.8} mt={1}>
            Current gas price could not be retrieved. Using last known price.
          </Text>
        )}
        {this.props.gasEstimateError && (
          <Text opacity={0.8} mt={1}>
            Gas limit could not be estimated. Using default.
          </Text>
        )}
      </View>
    )
  }
}

export default withGasEditorState(GasEditor)
