import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../../../common'
import ConverterIcon from '../../../icons/ConverterIcon'
import AuctionIcon from '../../../icons/AuctionIcon'
import ImportIcon from '../../../icons/ImportIcon'
import ExportIcon from '../../../icons/ExportIcon'
import TxIcon from '../../../icons/TxIcon'

export default class Icon extends React.Component {
  static propTypes = {
    confirmations: PropTypes.number.isRequired,
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    txType: PropTypes.oneOf([
      'import-requested',
      'attestation',
      'converted',
      'imported',
      'exported',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired
  }

  render() {
    const { isPending, isFailed, confirmations, txType } = this.props
    const color = isFailed ? 'danger' : 'primary'

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
        return <ConverterIcon color={color} />
      case 'auction':
        return <AuctionIcon color={color} />
      case 'import-requested':
      case 'imported':
        return <ImportIcon color={color} />
      case 'exported':
        return <ExportIcon color={color} />
      default:
        return <TxIcon color={color} />
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
