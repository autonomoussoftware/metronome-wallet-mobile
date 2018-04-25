import { RoutePager, View, Text, Btn } from '../common'
import withDashboardState from '../../shared/hocs/withDashboardState'
import ReceiveDrawer from './ReceiveDrawer'
import ReceiptDrawer from './ReceiptDrawer'
import TxListHeader from './TxListHeader'
import BalanceBlock from './BalanceBlock'
import SendDrawer from './SendDrawer'
import PropTypes from 'prop-types'
import { Link } from 'react-router-native'
import TxList from './TxList'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export default class Wallets extends React.Component {
  render() {
    return (
      <RoutePager
        pages={{
          '/wallets': withDashboardState(DashboardHome),
          '/wallets/send': SendDrawer,
          '/wallets/receive': ReceiveDrawer,
          '/wallets/receipt': ReceiptDrawer
        }}
      />
    )
  }
}

class DashboardHome extends React.Component {
  static propTypes = {
    sendDisabledReason: PropTypes.string,
    hasTransactions: PropTypes.bool.isRequired,
    sendDisabled: PropTypes.bool.isRequired
  }

  state = { selectedFilter: 'all' }

  selectFilter = key => this.setState({ selectedFilter: key })

  render() {
    return (
      <RN.ScrollView stickyHeaderIndices={[2]} style={styles.container}>
        <BalanceBlock />

        <View px={2} pt={3} pb={1}>
          <View row justify="space-between">
            <View grow={1} basis={0}>
              <Link
                component={Btn}
                disabled={this.props.sendDisabled}
                label="Send"
                block
                to="/wallets/send"
              />
            </View>
            <View mx={1} />
            <View grow={1} basis={0}>
              <Link
                component={Btn}
                label="Receive"
                block
                to="/wallets/receive"
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
