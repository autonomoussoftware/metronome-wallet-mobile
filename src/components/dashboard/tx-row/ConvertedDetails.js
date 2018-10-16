import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../common'

export default class ConvertedDetails extends React.Component {
  static propTypes = {
    convertedFrom: PropTypes.string,
    isPending: PropTypes.bool.isRequired
  }

  render() {
    return (
      <Text>
        {this.props.isPending && (
          <Text color="copy" size="xSmall" ls={0.4}>
            PENDING CONVERSION FROM{' '}
          </Text>
        )}

        <Text color="copy" weight="semibold" size="small">
          {this.props.convertedFrom}
        </Text>

        <Text color="copy" size="xSmall" ls={0.4}>
          {this.props.isPending ? ' TO ' : ' CONVERTED TO '}
        </Text>

        <Text color="copy" weight="semibold" size="small">
          {this.props.convertedFrom === 'ETH' ? 'MET' : 'ETH'}
        </Text>
      </Text>
    )
  }
}
