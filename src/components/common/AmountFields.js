import { errorPropTypes } from '../../utils'
import TextInput from './TextInput'
import PropTypes from 'prop-types'
import BaseBtn from './BaseBtn'
import React from 'react'
import Text from './Text'
import View from './View'

class AmountFields extends React.Component {
  static propTypes = {
    ethPlaceholder: PropTypes.string.isRequired,
    usdPlaceholder: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    ethAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    autoFocus: PropTypes.bool,
    errors: errorPropTypes('ethAmount', 'usdAmount')
  }

  render() {
    return (
      <View row align="center">
        <View grow={1} basis={0}>
          <TextInput
            placeholder={this.props.ethPlaceholder}
            postLabel={
              <BaseBtn
                textProps={{ opacity: 0.75 }}
                onPress={this.props.onMaxClick}
                label="MAX"
                size="small"
              />
            }
            autoFocus={this.props.autoFocus}
            onChange={this.props.onInputChange}
            error={this.props.errors.ethAmount}
            label="Amount (ETH)"
            value={this.props.ethAmount}
            id="ethAmount"
          />
        </View>
        <View mt={0.25} mx={1}>
          <Text>&larr;</Text>
          <Text>&rarr;</Text>
        </View>
        <View grow={1} basis={0}>
          <TextInput
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
