import * as selectors from 'metronome-wallet-ui-logic/src/selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import { View, Text } from '../../common'
import ScanIndicator from './ScanIndicator'
import Filter from './filter/Filter'

class TxListHeader extends React.Component {
  static propTypes = {
    hasTransactions: PropTypes.bool.isRequired,
    onWalletRefresh: PropTypes.func.isRequired,
    isMultiChain: PropTypes.bool.isRequired,
    selectFilter: PropTypes.func.isRequired,
    syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
    filter: PropTypes.string.isRequired
  }

  options = {
    all: 'ALL',
    sent: 'SENT',
    received: 'RECEIVED',
    auction: 'AUCTION',
    converted: 'CONVERTED',
    ...(this.props.isMultiChain ? { ported: 'PORTED' } : {})
  }

  render() {
    return (
      <View
        justify="space-between"
        align="center"
        row
        bg="primary"
        py={1}
        pr={1}
      >
        <View row align="center">
          <Text size="medium" pl={2} mr={1} py={1} shadow weight="semibold">
            Transactions
          </Text>
          {(this.props.hasTransactions ||
            !this.props.syncStatus === 'syncing') && (
            <ScanIndicator
              onWalletRefresh={this.props.onWalletRefresh}
              syncStatus={this.props.syncStatus}
            />
          )}
        </View>
        <Filter
          selectFilter={this.props.selectFilter}
          options={this.options}
          filter={this.props.filter}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  isMultiChain: selectors.getIsMultiChain(state)
})

export default connect(mapStateToProps)(TxListHeader)
