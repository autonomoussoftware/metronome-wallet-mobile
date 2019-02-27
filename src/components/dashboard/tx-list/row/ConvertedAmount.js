import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Text } from '../../../common'

export default class ConvertedAmount extends React.Component {
  static propTypes = {
    convertedFrom: PropTypes.string,
    coinSymbol: PropTypes.string.isRequired,
    fromValue: PropTypes.string,
    isFailed: PropTypes.bool.isRequired,
    toValue: PropTypes.string
  }

  render() {
    const {
      convertedFrom,
      coinSymbol,
      fromValue,
      isFailed,
      toValue
    } = this.props

    return (
      <React.Fragment>
        {fromValue ? (
          <DisplayValue
            color={isFailed ? 'danger' : 'primary'}
            value={fromValue}
            size="medium"
            post={convertedFrom === 'coin' ? ` ${coinSymbol}` : ' MET'}
          />
        ) : (
          <Text>New transaction</Text>
        )}

        {fromValue && toValue && (
          <React.Fragment>
            <Text color={isFailed ? 'danger' : 'primary'} mx={1}>
              &rarr;
            </Text>
            <DisplayValue
              color={isFailed ? 'danger' : 'primary'}
              value={toValue}
              size="medium"
              post={convertedFrom === 'coin' ? ' MET' : ` ${coinSymbol}`}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
