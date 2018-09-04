import { View, Text } from '../common'
import QRCodeScanner from 'react-native-qrcode-scanner'
import CloseIcon from '../icons/CloseIcon'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

export default class QRScanner extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired
  }

  render() {
    return (
      <RN.Modal
        onRequestClose={this.props.onClose}
        animationType="slide"
        visible={this.props.isVisible}
      >
        <View bg="dark" flex={1}>
          <QRCodeScanner
            onRead={this.props.onRead}
            topContent={
              <View
                justify="space-between"
                alignSelf="stretch"
                align="center"
                flex={1}
                row
                px={2}
              >
                <View shrink={1}>
                  <Text size="medium">
                    Point the camera to the QR code of the recipient address.
                  </Text>
                </View>
                <View ml={2}>
                  <RN.TouchableOpacity onPress={this.props.onClose}>
                    <CloseIcon size="20" color="light" />
                  </RN.TouchableOpacity>
                </View>
              </View>
            }
          />
        </View>
      </RN.Modal>
    )
  }
}
