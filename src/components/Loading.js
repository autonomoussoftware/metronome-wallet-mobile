import withLoadingState from 'metronome-wallet-ui-logic/src/hocs/withLoadingState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { PatternView, ChecklistItem, View, Text } from './common'

class Loading extends React.Component {
  static propTypes = {
    // isMultiChain: PropTypes.bool.isRequired,
    chainsStatus: PropTypes.objectOf(
      PropTypes.shape({
        hasBlockHeight: PropTypes.bool,
        hasCoinBalance: PropTypes.bool,
        hasMetBalance: PropTypes.bool,
        hasCoinRate: PropTypes.bool,
        displayName: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired
      })
    ).isRequired
  }

  render() {
    return (
      <PatternView>
        <View flex={1} justify="center" align="center">
          <RN.ActivityIndicator size="large" />

          <Text size="large" weight="bold" my={4}>
            Gathering Information...
          </Text>

          {Object.keys(this.props.chainsStatus).map(chainName => (
            <View key={chainName}>
              <ChecklistItem
                isActive={this.props.chainsStatus[chainName].hasBlockHeight}
                text="Blockchain status"
              />
              <ChecklistItem
                isActive={this.props.chainsStatus[chainName].hasCoinRate}
                text={`${
                  this.props.chainsStatus[chainName].symbol
                } exchange data`}
              />
              <ChecklistItem
                isActive={this.props.chainsStatus[chainName].hasCoinBalance}
                text={`${this.props.chainsStatus[chainName].symbol} balance`}
              />
              <ChecklistItem
                isActive={this.props.chainsStatus[chainName].hasMetBalance}
                text="MET balance"
              />
            </View>
          ))}
        </View>
      </PatternView>
    )
  }
}

export default withLoadingState(Loading)
