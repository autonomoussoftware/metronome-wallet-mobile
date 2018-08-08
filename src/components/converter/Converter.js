import { Text, View, Btn } from '../common'
import withConverterState from '../../shared/hocs/withConverterState'
import ConvertDrawer from './ConvertDrawer'
import RoutePager from '../common/RoutePager'
import PropTypes from 'prop-types'
import { Link } from 'react-router-native'
import Stats from './Stats'
import React from 'react'
import RN from 'react-native'

export default class Converter extends React.Component {
  render() {
    return (
      <RoutePager
        pages={{
          '/converter': withConverterState(ConverterHome),
          '/converter/convert': ConvertDrawer
        }}
      />
    )
  }
}

class ConverterHome extends React.Component {
  static propTypes = {
    convertDisabledReason: PropTypes.string,
    converterPriceUSD: PropTypes.string.isRequired,
    convertDisabled: PropTypes.bool.isRequired,
    converterStatus: PropTypes.object
  }

  render() {
    const {
      convertDisabledReason,
      converterPriceUSD,
      converterStatus,
      convertDisabled
    } = this.props

    return (
      <View flex={1} px={2} py={4} justify="space-between">
        {converterStatus ? (
          <React.Fragment>
            <View grow={1}>
              <Stats
                converterPriceUSD={converterPriceUSD}
                converterStatus={converterStatus}
              />
            </View>
            <Link
              component={Btn}
              disabled={convertDisabled}
              label="Convert"
              block
              to="/converter/convert"
              mt={2}
            />
            {convertDisabledReason && (
              <Text opacity={0.8} align="center" size="small" my={1}>
                {convertDisabledReason}
              </Text>
            )}
          </React.Fragment>
        ) : (
          <View flex={1} justify="center" align="center">
            <Text size="medium" mb={2}>
              Waiting for converter status...
            </Text>
            <RN.ActivityIndicator />
          </View>
        )}
      </View>
    )
  }
}
