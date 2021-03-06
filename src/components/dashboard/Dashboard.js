import withDashboardState from 'metronome-wallet-ui-logic/src/hocs/withDashboardState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { MenuBtn, View, Text, Btn } from '../common'
import ScanningTxPlaceholder from './tx-list/ScanningTxPlaceholder'
import NoTxPlaceholder from './tx-list/NoTxPlaceholder'
import RefreshControl from '../common/RefreshControl'
import TxListHeader from './tx-list/Header'
import BalanceBlock from './BalanceBlock'
import TxList from './tx-list/TxList'

class Dashboard extends React.Component {
  static propTypes = {
    sendDisabledReason: PropTypes.string,
    onWalletRefresh: PropTypes.func.isRequired,
    hasTransactions: PropTypes.bool.isRequired,
    refreshStatus: PropTypes.oneOf(['init', 'pending', 'success', 'failure']),
    sendDisabled: PropTypes.bool.isRequired,
    refreshError: PropTypes.string,
    syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  state = { selectedFilter: 'all' }

  selectFilter = key => this.setState({ selectedFilter: key })

  viewRef = null

  viewHeight = null

  storeViewRef = element => {
    this.viewRef = element
  }

  storeViewHeight = ({ nativeEvent }) => {
    this.viewHeight = nativeEvent.layout.height
  }

  // On content size change scroll to top if new height is shorter than the view
  scrollTopIfFewItems = (_, contentHeight) => {
    if (this.viewHeight && this.viewHeight >= contentHeight) {
      this.viewRef.scrollTo({ y: 0, animated: true })
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.refreshStatus !== prevProps.refreshStatus &&
      this.props.refreshStatus === 'failure'
    ) {
      RN.Alert.alert('Error', this.props.refreshError)
    }
  }

  render() {
    const showSpinner =
      this.props.refreshStatus === 'pending' ||
      this.props.syncStatus === 'syncing'

    return (
      <View
        contentContainerStyle={styles.scrollContainer}
        onContentSizeChange={this.scrollTopIfFewItems}
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl
            progressViewOffset={10}
            refreshing={this.props.refreshStatus === 'pending'}
            onRefresh={this.props.onWalletRefresh}
          />
        }
        onLayout={this.storeViewHeight}
        innerRef={this.storeViewRef}
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
          onWalletRefresh={this.props.onWalletRefresh}
          selectFilter={this.selectFilter}
          syncStatus={this.props.syncStatus}
          filter={this.state.selectedFilter}
        />

        {this.props.hasTransactions && (
          <TxList filter={this.state.selectedFilter} />
        )}

        {!this.props.hasTransactions && showSpinner && (
          <ScanningTxPlaceholder />
        )}

        {!this.props.hasTransactions && !showSpinner && <NoTxPlaceholder />}
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
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />,
  title: 'My Wallet'
})

export default EnhancedComponent
