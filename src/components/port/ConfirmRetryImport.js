import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, Text } from '../common'

class ConfirmRetryImport extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          destinationDisplayName: PropTypes.string.isRequired,
          originDisplayName: PropTypes.string.isRequired,
          onSubmit: PropTypes.func.isRequired,
          value: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      destinationDisplayName,
      originDisplayName,
      onSubmit,
      value
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">
          You will request an import of{' '}
          <DisplayValue value={value} post=" MET" color="primary" /> from the{' '}
          <Text color="primary">{originDisplayName}</Text> blockchain to the{' '}
          <Text color="primary">{destinationDisplayName}</Text> blockchain.
        </Text>
      </Confirmation>
    )
  }
}

ConfirmRetryImport.navigationOptions = {
  headerTitle: 'Confirm Retry'
}

export default ConfirmRetryImport
