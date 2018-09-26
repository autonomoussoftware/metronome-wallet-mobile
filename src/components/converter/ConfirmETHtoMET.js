import { DisplayValue, Confirmation, Text } from '../common'
import PropTypes from 'prop-types'
import React from 'react'

class ConfirmETHtoMET extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          ethAmount: PropTypes.string.isRequired,
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
      ethAmount,
      usdAmount,
      onSubmit,
      estimate,
      rate
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will convert{' '}
          <DisplayValue value={ethAmount} color="primary" toWei post=" ETH" />{' '}
          {usdAmount ? `($${usdAmount})` : `(< $0.01)`} and get approximately{' '}
          <DisplayValue value={estimate} post=" MET" color="primary" />, which
          means a rate of <DisplayValue value={rate} post=" ETH/MET" />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmETHtoMET.navigationOptions = {
  headerTitle: 'Convert ETH to MET'
}

export default ConfirmETHtoMET
