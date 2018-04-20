// import { View, Text } from '../common';
// import { Link } from 'react-router-native';
import withTxListState from '../../shared/hocs/withTxListState'
import PropTypes from 'prop-types'
import TxRow from './TxRow'
import React from 'react'
// import RN from 'react-native';

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
    return this.props.items
      .filter(tx => ['all', tx.parsed.txType].includes(this.props.filter))
      .map(tx => <TxRow key={tx.transaction.hash} {...tx} />)
  }
}

export default withTxListState(TxList)
