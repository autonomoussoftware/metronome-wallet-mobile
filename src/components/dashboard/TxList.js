import withTxListState from '../../shared/hocs/withTxListState'
import PropTypes from 'prop-types'
import LogoIcon from '../icons/LogoIcon'
import { View } from '../common'
import TxRow from './TxRow'
import React from 'react'

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

  render() {
    return (
      <React.Fragment>
        {this.props.items
          .filter(tx => ['all', tx.parsed.txType].includes(this.props.filter))
          .map(tx => (
            <TxRow key={tx.transaction.hash} {...tx} />
          ))}
        <View bg="light" align="center" py={4}>
          <LogoIcon />
        </View>
      </React.Fragment>
    )
  }
}

export default withTxListState(TxList)
