import { PatternView, ChecklistItem, View, Text } from './common'
import withLoadingState from '../shared/hocs/withLoadingState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

class Loading extends React.Component {
  static propTypes = {
    hasBlockHeight: PropTypes.bool.isRequired,
    hasEthBalance: PropTypes.bool.isRequired,
    hasMetBalance: PropTypes.bool.isRequired,
    hasEthRate: PropTypes.bool.isRequired
  }

  render() {
    return (
      <PatternView>
        <View flex={1} justify="center" align="center">
          <RN.ActivityIndicator size="large" />

          <Text size="large" weight="bold" my={4}>
            Gathering Information...
          </Text>

          <View>
            <ChecklistItem
              isActive={this.props.hasBlockHeight}
              text="Blockchain status"
            />
            <ChecklistItem
              isActive={this.props.hasEthRate}
              text="ETH exchange data"
            />
            <ChecklistItem
              isActive={this.props.hasEthBalance}
              text="ETH balance"
            />
            <ChecklistItem
              isActive={this.props.hasMetBalance}
              text="MET balance"
            />
          </View>
        </View>
      </PatternView>
    )
  }
}

export default withLoadingState(Loading)
