import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class ImportedDetails extends React.Component {
  static propTypes = {
    importedFrom: PropTypes.string,
    isPending: PropTypes.bool.isRequired
  }

  render() {
    return (
      <Text>
        <Text color="copy" size="xSmall" ls={0.4}>
          {this.props.isPending ? 'PENDING IMPORT FROM ' : 'IMPORTED FROM '}
        </Text>
        <Text color="copy" weight="semibold" size="small">
          {this.props.importedFrom}{' '}
        </Text>
        <Text color="copy" size="xSmall" ls={0.4}>
          BLOCKCHAIN
        </Text>
      </Text>
    )
  }
}
