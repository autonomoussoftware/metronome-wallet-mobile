import VersionNumber from 'react-native-version-number'
import PropTypes from 'prop-types'
import React from 'react'

import { View, Text } from '../common'

export default class AppMeta extends React.Component {
  render() {
    return (
      <View align="flex-end">
        <Row label="v">
          {VersionNumber.appVersion} (build {VersionNumber.buildVersion})
        </Row>
      </View>
    )
  }
}

const Row = ({ label, children }) => (
  <Text opacity={0.5} weight="semibold" color="light" size="xSmall" mt={0.25}>
    <Text>{label}</Text>
    {children}
  </Text>
)

Row.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired
}
