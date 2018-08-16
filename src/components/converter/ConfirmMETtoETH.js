import { DisplayValue, Confirmation, Text } from '../common'
import PropTypes from 'prop-types'
import React from 'react'

class ConfirmMETtoETH extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          metAmount: PropTypes.string.isRequired,
          estimate: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { metAmount, onSubmit, estimate } = this.props.navigation.state.params

    return (
      <Confirmation
        pendingText="This may take a while. You can close this and follow the status of the conversion in the transaction list."
        onSubmit={onSubmit}
      >
        <Text size="medium">
          You will convert{' '}
          <DisplayValue value={metAmount} color="primary" toWei post=" MET" />{' '}
          and get approximately{' '}
          <DisplayValue value={estimate} post=" ETH" color="primary" />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmMETtoETH.navigationOptions = {
  headerTitle: 'Convert MET to ETH'
}

export default ConfirmMETtoETH
