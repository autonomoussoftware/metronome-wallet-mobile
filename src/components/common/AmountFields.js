import PropTypes from 'prop-types'
import React from 'react'

import { errorPropTypes } from '../../utils'
import TextInput from './TextInput'
import BaseBtn from './BaseBtn'
import Text from './Text'
import View from './View'

class AmountFields extends React.Component {
  static propTypes = {
    coinPlaceholder: PropTypes.string.isRequired,
    usdPlaceholder: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    coinSymbol: PropTypes.string.isRequired,
    coinAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    autoFocus: PropTypes.bool,
    errors: errorPropTypes('coinAmount', 'usdAmount')
  }

  render() {
    return (
      <View row align="center">
        <View grow={1} basis={0}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder={this.props.coinPlaceholder}
            postLabel={
              <BaseBtn
                textProps={{ opacity: 0.8, weight: 'semibold' }}
                onPress={this.props.onMaxClick}
                label="MAX"
                size="xSmall"
              />
            }
            autoFocus={this.props.autoFocus}
            onChange={this.props.onInputChange}
            label={`Amount (${this.props.coinSymbol})`}
            error={this.props.errors.coinAmount}
            value={this.props.coinAmount}
            id="coinAmount"
          />
        </View>
        <View mt={0.25} mx={1}>
          <Text>&larr;</Text>
          <Text>&rarr;</Text>
        </View>
        <View grow={1} basis={0}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder={this.props.usdPlaceholder}
            onChange={this.props.onInputChange}
            error={this.props.errors.usdAmount}
            label="Amount (USD)"
            value={this.props.usdAmount}
            id="usdAmount"
          />
        </View>
      </View>
    )
  }
}

export default AmountFields
