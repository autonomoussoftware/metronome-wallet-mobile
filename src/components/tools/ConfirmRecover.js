import { Confirmation, Text } from '../common'
import PropTypes from 'prop-types'
import React from 'react'

class ConfirmRecover extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onSubmit: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { onSubmit } = this.props.navigation.state.params

    return (
      <Confirmation
        pendingTitle="Recovering..."
        pendingText="The application will restart when it is ready."
        noReceipt
        onSubmit={onSubmit}
      >
        <Text size="large">Are you sure?</Text>
        <Text mt={2} mb={1} size="medium">
          This operation will overwrite and restart the current wallet!
        </Text>
      </Confirmation>
    )
  }
}

ConfirmRecover.navigationOptions = {
  headerTitle: 'Wallet Recovery'
}

export default ConfirmRecover
