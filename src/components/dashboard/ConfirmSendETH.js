import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmSendETH extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          toAddress: PropTypes.string.isRequired,
          ethAmount: PropTypes.string.isRequired,
          usdAmount: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      toAddress,
      ethAmount,
      usdAmount,
      onSubmit
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will send{' '}
          <DisplayValue value={ethAmount} color="primary" toWei post=" ETH" />{' '}
          {usdAmount ? `($${usdAmount})` : `(< $0.01)`} to the address{' '}
          <Text color="primary" numberOfLines={1}>
            {toAddress}
          </Text>
          .
        </Text>
      </Confirmation>
    )
  }
}

ConfirmSendETH.navigationOptions = {
  headerTitle: 'Send ETH'
}

export default ConfirmSendETH
