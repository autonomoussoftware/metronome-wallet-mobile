import PropTypes from 'prop-types'
import React from 'react'

import ConverterIcon from '../../icons/ConverterIcon'
import AuctionIcon from '../../icons/AuctionIcon'
import TxIcon from '../../icons/TxIcon'
import View from '../View'
import Text from '../Text'

export default class TypeRow extends React.Component {
  static propTypes = {
    isCancelApproval: PropTypes.bool,
    isApproval: PropTypes.bool,
    txType: PropTypes.string.isRequired
  }

  render() {
    return (
      <View row my={3} justify="space-between">
        <Text size="large">Type</Text>

        <View shrink={1} align="center" row opacity={0.8}>
          {['sent', 'received'].includes(this.props.txType) && (
            <TxIcon size="20" />
          )}

          {this.props.txType === 'converted' && <ConverterIcon size="20" />}

          {this.props.txType === 'auction' && <AuctionIcon size="20" />}

          <Text size="large" ml={1.5}>
            {this.props.isCancelApproval
              ? 'Allowance canceled'
              : this.props.isApproval
              ? 'Allowance set'
              : (this.props.txType || '').toUpperCase()}
          </Text>
        </View>
      </View>
    )
  }
}
