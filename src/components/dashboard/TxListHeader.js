import { View, Text } from '../common'
import ScanIndicator from './ScanIndicator'
import PropTypes from 'prop-types'
import Filter from './filter/Filter'
import React from 'react'

class TxListHeader extends React.Component {
  static propTypes = {
    hasTransactions: PropTypes.bool.isRequired,
    selectFilter: PropTypes.func.isRequired,
    isScanning: PropTypes.bool.isRequired,
    filter: PropTypes.string.isRequired
  }

  options = {
    all: 'ALL',
    sent: 'SENT',
    received: 'RECEIVED',
    auction: 'AUCTION',
    converted: 'CONVERTED'
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
          {(this.props.hasTransactions || !this.props.isScanning) && (
            <ScanIndicator isScanning={this.props.isScanning} />
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

export default TxListHeader
