import withWalletInfoState from 'metronome-wallet-ui-logic/src/hocs/withWalletInfoState'
import VersionNumber from 'react-native-version-number'
import PropTypes from 'prop-types'
import React from 'react'

import { View, Text } from '../common'

class AppMeta extends React.Component {
  static propTypes = {
    chainName: PropTypes.string.isRequired,
    height: PropTypes.number
  }

  render() {
    return (
      <View align="flex-end">
        <Row label="chain">{this.props.chainName}</Row>
        <Row label="height">{this.props.height}</Row>
        <Row label="version">
          {VersionNumber.appVersion} (build {VersionNumber.buildVersion})
        </Row>
      </View>
    )
  }
}

const Row = ({ label, children }) => (
  <Text opacity={0.8} weight="semibold" color="light" size="xSmall" mt={0.25}>
    <Text opacity={0.5}>{label}</Text> {children}
  </Text>
)

Row.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired
}

export default withWalletInfoState(AppMeta)
