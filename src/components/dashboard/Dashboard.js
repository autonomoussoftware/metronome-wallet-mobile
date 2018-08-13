import { View, Text, Btn } from '../common'
import withDashboardState from '../../shared/hocs/withDashboardState'
import TxListHeader from './TxListHeader'
import BalanceBlock from './BalanceBlock'
import PropTypes from 'prop-types'
import TxList from './TxList'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

class Dashboard extends React.Component {
  static propTypes = {
    sendDisabledReason: PropTypes.string,
    hasTransactions: PropTypes.bool.isRequired,
    sendDisabled: PropTypes.bool.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  static navigationOptions = {
    title: 'a1',
    headerTitle: 'asdss'
    // headerBackTitle: null
  }

  state = { selectedFilter: 'all' }

  selectFilter = key => this.setState({ selectedFilter: key })

  render() {
    return (
      <RN.ScrollView stickyHeaderIndices={[2]} style={styles.container}>
        <BalanceBlock />

        <View px={2} pt={2} pb={1}>
          <View row justify="space-between">
            <View grow={1} basis={0}>
              <Btn
                disabled={this.props.sendDisabled}
                onPress={() => this.props.navigation.navigate('SendDrawer')}
                label="Send"
                block
              />
            </View>
            <View mx={1} />
            <View grow={1} basis={0}>
              <Btn
                onPress={() => this.props.navigation.navigate('ReceiveDrawer')}
                label="Receive"
                block
              />
            </View>
          </View>
          {this.props.sendDisabledReason && (
            <Text opacity={0.8} size="small" mt={1}>
              {this.props.sendDisabledReason}
            </Text>
          )}
        </View>

        {this.props.hasTransactions && (
          <TxListHeader
            selectFilter={this.selectFilter}
            filter={this.state.selectedFilter}
          />
        )}

        {this.props.hasTransactions && (
          <TxList filter={this.state.selectedFilter} />
        )}

        {!this.props.hasTransactions && (
          <View align="center" justify="center" my={4}>
            <Text>No transactions to show yet</Text>
          </View>
        )}
      </RN.ScrollView>
    )
  }
}
const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    flex: 1
  }
})

export default withDashboardState(Dashboard)
