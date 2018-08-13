import { Text, View, Btn } from '../common'
import withConverterState from '../../shared/hocs/withConverterState'
import PropTypes from 'prop-types'
import Stats from './Stats'
import React from 'react'
import RN from 'react-native'

class Converter extends React.Component {
  static propTypes = {
    convertDisabledReason: PropTypes.string,
    converterPriceUSD: PropTypes.string.isRequired,
    convertDisabled: PropTypes.bool.isRequired,
    converterStatus: PropTypes.object,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const {
      convertDisabledReason,
      converterPriceUSD,
      converterStatus,
      convertDisabled,
      navigation
    } = this.props

    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
        {converterStatus ? (
          <React.Fragment>
            <View grow={1}>
              <Stats
                converterPriceUSD={converterPriceUSD}
                converterStatus={converterStatus}
              />
            </View>
            <Btn
              disabled={convertDisabled}
              label="Convert"
              block
              onPress={() => navigation.navigate('ConvertDrawer')}
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

export default withConverterState(Converter)
