import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { DisplayValue, View, Text } from '../common'

export default class ItemRow extends React.Component {
  static propTypes = {
    retryDisabled: PropTypes.bool,
    onRetryClick: PropTypes.func.isRequired,
    details: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    badge: PropTypes.node.isRequired
  }

  render() {
    return (
      <View
        justify="space-between"
        style={styles.itemContainer}
        align="center"
        row
        bg="darkShade"
        mt={1.5}
        mx={-1}
        p={1}
      >
        <View grow={1}>
          <View row align="baseline" justify="space-between">
            <View bg="darkShade" px={1} py={0.25} style={styles.badge}>
              {this.props.badge}
            </View>
            <DisplayValue
              value={this.props.value}
              color="primary"
              size="large"
              post=" MET"
            />
          </View>
          <Text size="xSmall" ls={1} opacity={0.8} align="right">
            {this.props.details}
          </Text>
        </View>
        <RN.TouchableOpacity
          disabled={this.props.retryDisabled}
          onPress={this.props.onRetryClick}
        >
          <View
            opacity={this.props.retryDisabled ? 0.5 : 1}
            style={styles.btn}
            py={1}
            px={1.5}
            ml={1}
          >
            <Text>Retry</Text>
          </View>
        </RN.TouchableOpacity>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  itemContainer: {
    borderRadius: 4
  },
  badge: {
    borderRadius: 8
  },
  btn: {
    borderRadius: 12,
    backgroundColor: 'rgba(126, 97, 248, 0.4)'
  }
})
