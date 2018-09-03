import withTxListState from '../../shared/hocs/withTxListState'
import PropTypes from 'prop-types'
import LogoIcon from '../icons/LogoIcon'
import { View } from '../common'
import theme from '../../theme'
import TxRow from './TxRow'
import React from 'react'
import RN from 'react-native'

class TxList extends React.Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        transaction: PropTypes.shape({
          hash: PropTypes.string.isRequired
        }).isRequired
      })
    ).isRequired
  }

  getFilteredItems = () => {
    const { items, filter } = this.props
    return items.filter(tx => ['all', tx.parsed.txType].includes(filter))
  }

  keyExtractor = item => item.transaction.hash

  renderItem = ({ item }) => <TxRow {...item} />

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
        style={styles.container}
        data={this.getFilteredItems()}
      />
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: theme.colors.light
  }
})

export default withTxListState(TxList)
