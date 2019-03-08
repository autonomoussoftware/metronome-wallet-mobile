import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmPort extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          availableDestinations: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired
            })
          ).isRequired,
          sourceDisplayName: PropTypes.string.isRequired,
          destination: PropTypes.string.isRequired,
          metAmount: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired,
          fee: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      availableDestinations,
      sourceDisplayName,
      destination,
      metAmount,
      onSubmit,
      fee
    } = this.props.navigation.state.params

    const { label } = availableDestinations.find(
      ({ value }) => value === destination
    )

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will port{' '}
          <DisplayValue value={metAmount} toWei post=" MET" color="primary" />{' '}
          from the <Text color="primary">{sourceDisplayName}</Text> blockchain
          to the <Text color="primary">{label}</Text> blockchain, paying a fee
          of approximately{' '}
          <DisplayValue value={fee} post=" MET" color="primary" />.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmPort.navigationOptions = {
  headerTitle: 'Confirm Port'
}

export default ConfirmPort
