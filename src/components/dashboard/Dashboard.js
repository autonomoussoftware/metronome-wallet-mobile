import { MenuBtn, View, Text, Btn } from '../common'
import ScanningTxPlaceholder from './ScanningTxPlaceholder'
import withDashboardState from '../../shared/hocs/withDashboardState'
import NoTxPlaceholder from './NoTxPlaceholder'
import TxListHeader from './TxListHeader'
import BalanceBlock from './BalanceBlock'
import PropTypes from 'prop-types'
import TxList from './TxList'
import React from 'react'
import RN from 'react-native'

class Dashboard extends React.Component {
  static propTypes = {
    sendDisabledReason: PropTypes.string,
    hasTransactions: PropTypes.bool.isRequired,
    isScanningTx: PropTypes.bool.isRequired,
    sendDisabled: PropTypes.bool.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  state = { selectedFilter: 'all' }

  selectFilter = key => this.setState({ selectedFilter: key })

  render() {
    return (
      <View
        contentContainerStyle={styles.scrollContainer}
        alwaysBounceVertical={false}
        stickyHeaderIndices={[2]}
        scroll
        flex={1}
        bg="primary"
      >
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

        <TxListHeader
          hasTransactions={this.props.hasTransactions}
          isScanningTx={this.props.isScanningTx}
          selectFilter={this.selectFilter}
          filter={this.state.selectedFilter}
        />

        {this.props.hasTransactions && (
          <TxList filter={this.state.selectedFilter} />
        )}

        {!this.props.hasTransactions &&
          this.props.isScanningTx && <ScanningTxPlaceholder />}

        {!this.props.hasTransactions &&
          !this.props.isScanningTx && <NoTxPlaceholder />}
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  scrollContainer: {
    // expand ScrollView content if smaller than viewport:
    justifyContent: 'flex-start',
    flexGrow: 1
  }
})

const EnhancedComponent = withDashboardState(Dashboard)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  title: 'My Wallet',
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
