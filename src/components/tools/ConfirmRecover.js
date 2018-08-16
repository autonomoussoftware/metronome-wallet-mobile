import { Confirmation, View, Text } from '../common'
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
      <Confirmation onSubmit={onSubmit} pendingText="Recovering...">
        <View>
          <Text size="large">Are you sure?</Text>
          <Text mt={2} mb={4} size="medium">
            This operation will overwrite and restart the current wallet!
          </Text>
        </View>
      </Confirmation>
    )
  }
}

ConfirmRecover.navigationOptions = {
  headerTitle: 'Wallet Recovery'
}

export default ConfirmRecover
