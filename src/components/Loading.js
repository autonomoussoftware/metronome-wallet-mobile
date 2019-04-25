import withLoadingState from 'metronome-wallet-ui-logic/src/hocs/withLoadingState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { PatternView, ChecklistItem, View, Text } from './common'

class Loading extends React.Component {
  static propTypes = {
    isMultiChain: PropTypes.bool.isRequired,
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
    const isCondensed = Object.keys(this.props.chainsStatus).length > 2

    return (
      <PatternView>
        <View flex={1} justify="center" align="center">
          <RN.ActivityIndicator size="large" />

          <Text size="large" weight="bold" my={4}>
            Gathering Information...
          </Text>

          {Object.keys(this.props.chainsStatus).map((chainName, i) => (
            <View key={chainName}>
              {this.props.isMultiChain && (
                <Text
                  size="xSmall"
                  opacity={0.8}
                  mt={i === 0 ? 0 : 3}
                  ml={isCondensed ? 3.5 : 5.25}
                  ls={1}
                >
                  {(
                    this.props.chainsStatus[chainName].displayName || ''
                  ).toUpperCase()}
                </Text>
              )}
              <ChecklistItem
                isCondensed={isCondensed}
                isActive={this.props.chainsStatus[chainName].hasBlockHeight}
                text="Blockchain status"
              />
              <ChecklistItem
                isCondensed={isCondensed}
                isActive={this.props.chainsStatus[chainName].hasCoinRate}
                text={`${
                  this.props.chainsStatus[chainName].symbol
                } exchange data`}
              />
              <ChecklistItem
                isCondensed={isCondensed}
                isActive={this.props.chainsStatus[chainName].hasCoinBalance}
                text={`${this.props.chainsStatus[chainName].symbol} balance`}
              />
              <ChecklistItem
                isCondensed={isCondensed}
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
