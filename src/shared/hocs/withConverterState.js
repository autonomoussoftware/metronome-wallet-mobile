import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withConverterState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      convertFeatureStatus: PropTypes.oneOf([
        'in-initial-auction',
        'transfer-disabled',
        'offline',
        'ok'
      ]).isRequired,
      converterPriceUSD: PropTypes.string.isRequired,
      converterStatus: PropTypes.shape({
        availableEth: PropTypes.string.isRequired,
        availableMet: PropTypes.string.isRequired
      })
    }

    static displayName = `withConverterState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      const { convertFeatureStatus } = this.props

      const convertDisabledReason =
        convertFeatureStatus === 'offline'
          ? "Can't convert while offline"
          : convertFeatureStatus === 'in-initial-auction'
            ? 'Conversions are disabled during Initial Auction'
            : convertFeatureStatus === 'transfer-disabled'
              ? 'MET conversions not enabled yet'
              : null

      return (
        <WrappedComponent
          convertDisabledReason={convertDisabledReason}
          convertDisabled={convertFeatureStatus !== 'ok'}
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    convertFeatureStatus: selectors.convertFeatureStatus(state),
    converterPriceUSD: selectors.getConverterPriceUSD(state),
    converterStatus: selectors.getConverterStatus(state)
  })

  return connect(mapStateToProps)(Container)
}

export default withConverterState