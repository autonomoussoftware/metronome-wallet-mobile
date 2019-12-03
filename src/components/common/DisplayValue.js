import withDisplayValueState from 'metronome-wallet-ui-logic/src/hocs/withDisplayValueState'
import { sanitize } from 'metronome-wallet-ui-logic/src/utils'
import smartRounder from 'smart-round'
import PropTypes from 'prop-types'
import React from 'react'

import Text from './Text'

class DisplayValue extends React.Component {
  static propTypes = {
    coinDecimals: PropTypes.number.isRequired,
    maxPrecision: PropTypes.number,
    shouldFormat: PropTypes.bool,
    useDecimals: PropTypes.bool,
    minDecimals: PropTypes.number,
    maxDecimals: PropTypes.number,
    coinSymbol: PropTypes.string.isRequired,
    fromWei: PropTypes.func.isRequired,
    isCoin: PropTypes.bool,
    value: PropTypes.string,
    toWei: PropTypes.bool,
    post: PropTypes.string,
    pre: PropTypes.string
  }

  static defaultProps = {
    shouldFormat: true,
    maxPrecision: 6,
    minDecimals: 0,
    maxDecimals: 6
  }

  round = smartRounder(
    this.props.maxPrecision,
    this.props.minDecimals,
    this.props.maxDecimals
  )

  render() {
    const {
      shouldFormat,
      coinDecimals,
      useDecimals,
      coinSymbol,
      fromWei,
      isCoin,
      toWei,
      value,
      post,
      pre,
      ...other
    } = this.props

    let formattedValue

    try {
      formattedValue = this.round(
        toWei
          ? sanitize(value)
          : fromWei(
              useDecimals ? `${value}${'0'.repeat(18 - coinDecimals)}` : value
            ),

        shouldFormat
      )
    } catch (e) {
      formattedValue = null
    }

    return (
      <Text numberOfLines={1} adjustsFontSizeToFit {...other}>
        {pre}
        {formattedValue || '?'}
        {isCoin ? ` ${coinSymbol}` : post}
      </Text>
    )
  }
}

export default withDisplayValueState(DisplayValue)
