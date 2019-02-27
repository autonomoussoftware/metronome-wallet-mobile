import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmCoinToMET extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          coinAmount: PropTypes.string.isRequired,
          coinSymbol: PropTypes.string.isRequired,
          usdAmount: PropTypes.string.isRequired,
          estimate: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired,
          rate: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      coinAmount,
      coinSymbol,
      usdAmount,
      onSubmit,
      estimate,
      rate
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will convert{' '}
          <DisplayValue value={coinAmount} color="primary" toWei isCoin />{' '}
          {usdAmount ? `($${usdAmount})` : `(< $0.01)`} and get approximately{' '}
          <DisplayValue value={estimate} post=" MET" color="primary" />, which
          means a rate of{' '}
          <DisplayValue value={rate} post={` ${coinSymbol}/MET`} />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmCoinToMET.navigationOptions = ({ navigation }) => ({
  headerTitle: `Convert ${navigation.getParam('coinSymbol', 'Coin')} to MET`
})

export default ConfirmCoinToMET
