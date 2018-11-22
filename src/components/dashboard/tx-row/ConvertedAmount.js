import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Text } from '../../common'

export default class ConvertedAmount extends React.Component {
  static propTypes = {
    convertedFrom: PropTypes.string,
    fromValue: PropTypes.string,
    isFailed: PropTypes.bool.isRequired,
    toValue: PropTypes.string
  }

  render() {
    const { convertedFrom, fromValue, isFailed, toValue } = this.props

    return (
      <React.Fragment>
        {fromValue ? (
          <DisplayValue
            color={isFailed ? 'danger' : 'primary'}
            value={fromValue}
            size="medium"
            post={convertedFrom === 'ETH' ? ' ETH' : ' MET'}
          />
        ) : (
          <Text>New transaction</Text>
        )}

        {fromValue &&
          toValue && (
            <React.Fragment>
              <Text color={isFailed ? 'danger' : 'primary'} mx={1}>
                &rarr;
              </Text>
              <DisplayValue
                color={isFailed ? 'danger' : 'primary'}
                value={toValue}
                size="medium"
                post={convertedFrom === 'ETH' ? ' MET' : ' ETH'}
              />
            </React.Fragment>
          )}
      </React.Fragment>
    )
  }
}
