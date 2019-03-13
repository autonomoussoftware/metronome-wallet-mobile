import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class ExportedDetails extends React.Component {
  static propTypes = {
    exportedTo: PropTypes.string,
    isPending: PropTypes.bool.isRequired
  }

  render() {
    return (
      <Text>
        <Text color="copy" size="xSmall" ls={0.4}>
          {this.props.isPending ? 'PENDING EXPORT TO ' : 'EXPORTED TO '}
        </Text>
        <Text color="copy" weight="semibold" size="small">
          {this.props.exportedTo}{' '}
        </Text>
        <Text color="copy" size="xSmall" ls={0.4}>
          BLOCKCHAIN
        </Text>
      </Text>
    )
  }
}
