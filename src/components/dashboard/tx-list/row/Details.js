import PropTypes from 'prop-types'
import React from 'react'

import ImportRequestedDetails from './ImportRequestedDetails'
import AttestationDetails from './AttestationDetails'
import ConvertedDetails from './ConvertedDetails'
import ImportedDetails from './ImportedDetails'
import ExportedDetails from './ExportedDetails'
import ReceivedDetails from './ReceivedDetails'
import AuctionDetails from './AuctionDetails'
import SentDetails from './SentDetails'
import { Text } from '../../../common'

export default class Details extends React.Component {
  static propTypes = {
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
    if (this.props.isFailed) {
      return (
        <Text size="xSmall" color="danger" ls={0.4}>
          FAILED TRANSACTION
        </Text>
      )
    }

    switch (this.props.txType) {
      case 'sent':
        return <SentDetails {...this.props} />
      case 'auction':
        return <AuctionDetails {...this.props} />
      case 'received':
        return <ReceivedDetails {...this.props} />
      case 'converted':
        return <ConvertedDetails {...this.props} />
      case 'import-requested':
        return <ImportRequestedDetails {...this.props} />
      case 'imported':
        return <ImportedDetails {...this.props} />
      case 'exported':
        return <ExportedDetails {...this.props} />
      case 'attestation':
        return <AttestationDetails {...this.props} />
      default:
        return <Text color="weak">Waiting for metadata</Text>
    }
  }
}
