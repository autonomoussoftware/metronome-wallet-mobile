import withTxListState from 'metronome-wallet-ui-logic/src/hocs/withTxListState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import LogoIcon from '../../icons/LogoIcon'
import { View } from '../../common'
import Row from './row/Row'

class TxList extends React.Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        txType: PropTypes.string.isRequired,
        hash: PropTypes.string.isRequired
      })
    ).isRequired
  }

  getFilteredItems = () => {
    const { items, filter } = this.props
    return items.filter(tx => ['all', tx.txType].includes(filter))
  }

  keyExtractor = item => item.hash

  renderItem = ({ item }) => <Row tx={item} />

  footer = (
    <View bg="light" align="center" py={4}>
      <LogoIcon />
    </View>
  )

  render() {
    return (
      <RN.FlatList
        ListFooterComponent={this.footer}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        data={this.getFilteredItems()}
      />
    )
  }
}

export default withTxListState(TxList)
