import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class ImportRequestedDetails extends React.Component {
  static propTypes = {
    importedFrom: PropTypes.string,
    isPending: PropTypes.bool.isRequired
  }

  render() {
    return (
      <Text>
        {this.props.isPending ? (
          <React.Fragment>
            <Text color="copy" size="xSmall" ls={0.4}>
              PENDING IMPORT REQUEST FROM{' '}
            </Text>
            <Text color="copy" weight="semibold" size="small">
              {this.props.importedFrom}{' '}
            </Text>
            <Text color="copy" size="xSmall" ls={0.4}>
              BLOCKCHAIN
            </Text>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text color="copy" size="xSmall" ls={0.4}>
              IMPORT FROM{' '}
            </Text>
            <Text color="copy" weight="semibold" size="small">
              {this.props.importedFrom}{' '}
            </Text>
            <Text color="copy" size="xSmall" ls={0.4}>
              BLOCKCHAIN REQUESTED
            </Text>
          </React.Fragment>
        )}
      </Text>
    )
  }
}
