import { withClient } from '../../shared/hocs/clientContext'
import smartRounder from 'smart-round'
import PropTypes from 'prop-types'
import React from 'react'
import Text from './Text'

class DisplayValue extends React.Component {
  static propTypes = {
    maxPrecision: PropTypes.number,
    shouldFormat: PropTypes.bool,
    minDecimals: PropTypes.number,
    maxDecimals: PropTypes.number,
    client: PropTypes.shape({
      fromWei: PropTypes.func.isRequired
    }).isRequired,
    value: PropTypes.string,
    post: PropTypes.string,
    pre: PropTypes.string
  }

  static defaultProps = {
    shouldFormat: true,
    maxPrecision: 6,
    minDecimals: 0,
    maxDecimals: 6,
    maxSize: 'inherit'
  }

  round = smartRounder(
    this.props.maxPrecision,
    this.props.minDecimals,
    this.props.maxDecimals
  )

  render() {
    const { shouldFormat, client, value, post, pre, ...other } = this.props

    let formattedValue

    try {
      formattedValue = this.round(client.fromWei(value), shouldFormat)
    } catch (e) {
      formattedValue = null
    }

    return (
      <Text numberOfLines={1} adjustsFontSizeToFit {...other}>
        {pre}
        {formattedValue || '?'}
        {post}
      </Text>
    )
  }
}

export default withClient(DisplayValue)
