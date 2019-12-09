import withWalletInfoState from 'metronome-wallet-ui-logic/src/hocs/withWalletInfoState'
import VersionNumber from 'react-native-version-number'
import PropTypes from 'prop-types'
import React from 'react'

import { IndicatorLed, LastUpdated, View, Text } from '../common'
import { Label } from '../common/LastUpdated'

class AppMeta extends React.Component {
  static propTypes = {
    bestBlockTimestamp: PropTypes.number,
    connections: PropTypes.objectOf(PropTypes.bool).isRequired,
    chainName: PropTypes.string.isRequired,
    isOnline: PropTypes.bool,
    height: PropTypes.number
  }

  render() {
    return (
      <View>
        <Text size="small" mt={0.25}>
          Version {VersionNumber.appVersion} (build {VersionNumber.buildVersion}
          )
        </Text>
        <Text size="small" mt={1}>
          Connected to {this.props.chainName} chain
        </Text>
        <LastUpdated
          timestamp={this.props.bestBlockTimestamp}
          render={({ timeAgo, level }) => (
            <Text size="small" mt={1}>
              Best Block {this.props.height}{' '}
              <Label level={level}>mined {timeAgo}</Label>
            </Text>
          )}
        />
        <View row align="center" mt={2}>
          {Object.keys(this.props.connections).map(connectionName => (
            <View key={connectionName} row align="baseline">
              <IndicatorLed
                color={
                  this.props.isOnline
                    ? this.props.connections[connectionName]
                      ? 'success'
                      : 'danger'
                    : 'darkDanger'
                }
              />
              <Text ml={1} mr={2}>
                {connectionName}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default withWalletInfoState(AppMeta)
