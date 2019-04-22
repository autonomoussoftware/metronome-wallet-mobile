import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../common'
import { Errors } from '../common/TextInput'

export default class ReadOnlyField extends React.Component {
  static propTypes = {
    suffix: PropTypes.node,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
  }

  render() {
    const hasErrors = this.props.error && this.props.error.length > 0

    return (
      <View>
        <View mb={0.5} row justify="space-between" align="center">
          <Text weight="semibold" ls={0.5} shadow style={styles.label}>
            {this.props.label}
          </Text>
        </View>
        <View
          justify="space-between"
          style={styles.field}
          align="center"
          row
          bg="lightShade"
          px={2}
        >
          <Text size="medium">{this.props.value}</Text>
          {this.props.suffix}
        </View>
        <Errors hasErrors={hasErrors} message={this.props.error} />
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  label: {
    fontSize: 13,
    lineHeight: 16
  },
  field: {
    minHeight: 56
  }
})
