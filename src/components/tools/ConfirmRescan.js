import { View, Text, Btn } from '../common'
import PropTypes from 'prop-types'
import React from 'react'

class ConfirmRescan extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onRescanTransactions: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { onRescanTransactions } = this.props.navigation.state.params

    return (
      <View bg="dark" flex={1} py={4} px={2}>
        <Text size="large">Rescan Transactions</Text>
        <Text mt={2} mb={4} size="medium">
          Rescanning your transactions will close and re-open the app. You will
          need to log back in.
        </Text>
        <Btn
          onPress={onRescanTransactions}
          label="Confirm and Log Out"
          block
          mt={3}
        />
      </View>
    )
  }
}

ConfirmRescan.navigationOptions = {
  headerTitle: 'Confirm Rescan'
}

export default ConfirmRescan
