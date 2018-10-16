import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmMETtoETH extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
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
          <DisplayValue value={estimate} post=" ETH" color="primary" />, which
          means a rate of <DisplayValue value={rate} post=" ETH/MET" />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmMETtoETH.navigationOptions = {
  headerTitle: 'Convert MET to ETH'
}

export default ConfirmMETtoETH
