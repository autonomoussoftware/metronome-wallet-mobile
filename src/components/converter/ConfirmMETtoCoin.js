import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmMETtoCoin extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          coinSymbol: PropTypes.string.isRequired,
          metAmount: PropTypes.string.isRequired,
          estimate: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired,
          rate: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      coinSymbol,
      metAmount,
      onSubmit,
      estimate,
      rate
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will convert{' '}
          <DisplayValue value={metAmount} color="primary" toWei post=" MET" />{' '}
          and get approximately{' '}
          <DisplayValue value={estimate} color="primary" isCoin />, which means
          a rate of <DisplayValue value={rate} post={` ${coinSymbol}/MET`} />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmMETtoCoin.navigationOptions = ({ navigation }) => ({
  headerTitle: `Convert MET to ${navigation.getParam('coinSymbol', 'Coin')}`
})

export default ConfirmMETtoCoin
