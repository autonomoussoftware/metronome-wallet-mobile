import { withClient } from '../../shared/hocs/clientContext'
import { smartRound } from '../../shared/utils'
import PropTypes from 'prop-types'
import React from 'react'
import Text from './Text'

class DisplayValue extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      fromWei: PropTypes.func.isRequired
    }).isRequired,
    value: PropTypes.string,
    post: PropTypes.string,
    pre: PropTypes.string
  }

  render() {
    const { value, post, pre, client, ...other } = this.props

    let formattedValue

    try {
      formattedValue = smartRound(client, value)
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
