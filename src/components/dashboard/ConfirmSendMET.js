import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmSendMET extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          toAddress: PropTypes.string.isRequired,
          metAmount: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      toAddress,
      metAmount,
      onSubmit
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will send{' '}
          <DisplayValue value={metAmount} color="primary" toWei post=" MET" />{' '}
          to the address{' '}
          <Text color="primary" numberOfLines={1}>
            {toAddress}
          </Text>
          .
        </Text>
      </Confirmation>
    )
  }
}

ConfirmSendMET.navigationOptions = {
  headerTitle: 'Send MET'
}

export default ConfirmSendMET
