import withReceiveDrawerState from 'metronome-wallet-ui-logic/src/hocs/withReceiveDrawerState'
import PropTypes from 'prop-types'
import QRCode from 'react-native-qrcode-svg'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../common'
import CopyIcon from '../icons/CopyIcon'

class ReceiveDrawer extends React.Component {
  static propTypes = {
    copyToClipboard: PropTypes.func.isRequired,
    copyBtnLabel: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }

  render() {
    return (
      <View flex={1} align="center" pb={2} px={2} bg="dark">
        <View basis={0} grow={1} align="center" justify="space-evenly">
          <Text>Your address</Text>
          <View bg="darkShade" p={1}>
            <Text
              adjustsFontSizeToFit
              selectionColor={theme.colors.translucentPrimary}
              numberOfLines={1}
              selectable
            >
              {this.props.address}
            </Text>
          </View>
        </View>
        <View bg="light" p={1}>
          <QRCode
            value={this.props.address}
            size={RN.Dimensions.get('window').width * 0.6}
          />
        </View>
        <View basis={0} grow={1} justify="space-evenly">
          <RN.TouchableOpacity
            activeOpacity={0.75}
            onPress={this.props.copyToClipboard}
            style={styles.copyBtn}
          >
            <View style={styles.iconBg}>
              <CopyIcon />
            </View>
            <Text>{this.props.copyBtnLabel}</Text>
          </RN.TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  copyBtn: {
    alignItems: 'center'
  },
  iconBg: {
    backgroundColor: theme.colors.translucentPrimary,
    justifyContent: 'center',
    borderRadius: theme.spacing(4),
    alignItems: 'center',
    height: theme.spacing(8),
    width: theme.spacing(8),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
})

const EnhancedComponent = withReceiveDrawerState(ReceiveDrawer)

EnhancedComponent.navigationOptions = {
  headerTitle: 'Receive'
}

export default EnhancedComponent
