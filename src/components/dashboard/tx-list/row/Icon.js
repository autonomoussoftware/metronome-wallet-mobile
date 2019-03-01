import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../../../common'
import ConverterIcon from '../../../icons/ConverterIcon'
import AuctionIcon from '../../../icons/AuctionIcon'
import TxIcon from '../../../icons/TxIcon'

export default class Icon extends React.Component {
  static propTypes = {
    confirmations: PropTypes.number.isRequired,
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    txType: PropTypes.oneOf([
      'converted',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired
  }

  render() {
    const { isPending, isFailed, confirmations, txType } = this.props

    if (txType === 'unknown' || isPending) {
      return (
        <View style={styles.confirmations}>
          <Text color="dark" size="xSmall" weight="semibold">
            {confirmations}
          </Text>
        </View>
      )
    }

    switch (txType) {
      case 'converted':
        return <ConverterIcon color={isFailed ? 'danger' : 'primary'} />
      case 'auction':
        return <AuctionIcon color={isFailed ? 'danger' : 'primary'} />
      default:
        return <TxIcon color={isFailed ? 'danger' : 'primary'} />
    }
  }
}

const styles = RN.StyleSheet.create({
  confirmations: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.dark,
    opacity: 0.5,
    height: 24,
    width: 24
  }
})
