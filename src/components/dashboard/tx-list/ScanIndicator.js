import withScanIndicatorState from 'metronome-wallet-ui-logic/src/hocs/withScanIndicatorState'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { IndicatorLed, Spinner, View, Text } from '../../common'

class ScanIndicator extends React.Component {
  static propTypes = {
    syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
    isOnline: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired
  }

  render() {
    return (
      <View
        style={styles.container}
        align="center"
        row
        bg="lightShade"
        py={0.5}
        pl={0.5}
        pr={0.8}
      >
        {this.props.isOnline && this.props.syncStatus === 'syncing' ? (
          <Spinner
            color={
              RN.Platform.OS === 'android'
                ? theme.colors.primary
                : theme.colors.light
            }
            size={14}
          />
        ) : (
          <IndicatorLed
            color={
              this.props.syncStatus === 'failed'
                ? this.props.isOnline
                  ? 'danger'
                  : 'darkDanger'
                : this.props.isOnline
                ? 'success'
                : 'darkSuccess'
            }
          />
        )}
        <Text
          weight="semibold"
          style={styles.label}
          color="light"
          ls={0.5}
          ml={0.8}
        >
          {this.props.label}
        </Text>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 12,
    top: 1
  },
  label: {
    fontSize: 12
  }
})

export default withScanIndicatorState(ScanIndicator)
