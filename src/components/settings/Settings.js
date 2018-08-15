import { TextInput, Text, View, Btn } from '../common'
import withSettingsState from '../../shared/hocs/withSettingsState'
import PropTypes from 'prop-types'
import React from 'react'

class Settings extends React.Component {
  static propTypes = {
    onRescanTransactions: PropTypes.func.isRequired,
    onNetworkUrlSubmit: PropTypes.func.isRequired,
    ethereumNetworkUrl: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    errors: PropTypes.shape({
      ethereumNetworkUrl: PropTypes.string
    }).isRequired
  }

  render() {
    return (
      <View bg="dark" flex={1} py={4} px={2}>
        <TextInput
          disabled={this.props.ethereumNetworkUrl === null}
          onChange={this.props.onInputChange}
          error={this.props.errors.ethereumNetworkUrl}
          value={this.props.ethereumNetworkUrl}
          label="Ethereum Network URL"
          id="ethereumNetworkUrl"
        />
        <Btn
          disabled={this.props.ethereumNetworkUrl === null}
          label="Save & Restart"
          onPress={this.props.onNetworkUrlSubmit}
        />

        <Text mt={8} mb={2} opacity={0.75}>
          This will clear the wallet cache and rescan all the transactions
          linked to your wallet addresses.
        </Text>
        <Btn
          onPress={this.props.onRescanTransactions}
          label="Rescan Transactions"
        />
      </View>
    )
  }
}

export default withSettingsState(Settings)
