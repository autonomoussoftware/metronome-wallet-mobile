import withScanIndicatorState from 'metronome-wallet-ui-logic/src/hocs/withScanIndicatorState'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { Spinner, View, Text } from '../../common'

const GreenLight = ({ isOnline }) => (
  <View
    style={[
      styles.greenLight,
      {
        backgroundColor: isOnline
          ? theme.colors.success
          : theme.colors.darkSuccess
      }
    ]}
  />
)

GreenLight.propTypes = {
  isOnline: PropTypes.bool.isRequired
}

class ScanIndicator extends React.Component {
  static propTypes = {
    isScanning: PropTypes.bool.isRequired,
    isOnline: PropTypes.bool.isRequired
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
        {this.props.isOnline && this.props.isScanning ? (
          <Spinner size={14} />
        ) : (
          <GreenLight isOnline={this.props.isOnline} />
        )}
        <Text
          weight="semibold"
          style={styles.label}
          color="light"
          ls={0.5}
          ml={0.8}
        >
          {!this.props.isOnline
            ? 'Offline'
            : this.props.isScanning
              ? 'Fetching…'
              : 'Up-to-date'}
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
  },
  greenLight: {
    borderRadius: 10,
    borderColor: theme.colors.light,
    borderWidth: 1,
    marginLeft: 3,
    height: 10,
    width: 10
  }
})

export default withScanIndicatorState(ScanIndicator)
