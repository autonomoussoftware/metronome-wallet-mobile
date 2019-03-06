import PropTypes from 'prop-types'
import React from 'react'

import { Confirmation, Text } from '../common'

class ConfirmPort extends React.Component {
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
      <Confirmation onSubmit={onSubmit}>
        <Text size="medium">Confirmation text</Text>
      </Confirmation>
    )
  }
}

ConfirmPort.navigationOptions = {
  headerTitle: 'Confirm'
}

export default ConfirmPort
