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
          <GreenLight isOnline={this.props.isOnline} />
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
