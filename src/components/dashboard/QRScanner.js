import { View, Text } from '../common'
import QRCodeScanner from 'react-native-qrcode-scanner'
import CloseIcon from '../icons/CloseIcon'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

export default class QRScanner extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired
  }

  render() {
    return (
      <View style={styles.container} bg="dark">
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
              <Text size="medium">
                Point the camera to the QR code of the recipient address.
              </Text>
              <RN.TouchableOpacity onPress={this.props.onClose}>
                <CloseIcon size="20" color="light" />
              </RN.TouchableOpacity>
            </View>
          }
        />
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})
