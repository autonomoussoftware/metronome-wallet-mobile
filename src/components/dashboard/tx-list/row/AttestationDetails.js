import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class AttestationDetails extends React.Component {
  static propTypes = {
    isAttestationValid: PropTypes.bool
  }

  render() {
    return (
      <Text numberOfLines={1} align="right" color="copy" size="xSmall" ls={0.4}>
        A VALIDATOR {this.props.isAttestationValid ? 'ATTESTED' : 'REFUTED'} AN
        IMPORT
      </Text>
    )
  }
}
