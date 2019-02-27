import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmSendCoin extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          coinAmount: PropTypes.string.isRequired,
          toAddress: PropTypes.string.isRequired,
          usdAmount: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      coinAmount,
      toAddress,
      usdAmount,
      onSubmit
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will send{' '}
          <DisplayValue value={coinAmount} color="primary" toWei isCoin />{' '}
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

ConfirmSendCoin.navigationOptions = ({ navigation }) => ({
  headerTitle: `Send ${navigation.getParam('coinSymbol', 'Coin')}`
})

export default ConfirmSendCoin
