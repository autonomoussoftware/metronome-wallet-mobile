import withBlockchainState from '../../shared/hocs/withBlockchainState'
import { View, Text } from '../common'
import VersionNumber from 'react-native-version-number'
import PropTypes from 'prop-types'
import config from '../../config'
import React from 'react'

class AppMeta extends React.Component {
  static propTypes = {
    blockchainHeight: PropTypes.number.isRequired
  }

  render() {
    return (
      <View align="flex-end">
        <Row label="chain">
          {config.eth.chain.charAt(0).toUpperCase() + config.eth.chain.slice(1)}
        </Row>
        <Row label="height">{this.props.blockchainHeight}</Row>
        <Row label="v">
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

export default withBlockchainState(AppMeta)
