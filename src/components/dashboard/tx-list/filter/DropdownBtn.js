import { Svg, G, Line } from 'react-native-svg'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../../../common'

export default class DropdownBtn extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    label: PropTypes.string.isRequired
  }

  static defaultProps = {
    isOpen: false
  }

  render() {
    const shouldCondenseLabel =
      ['RECEIVED', 'CONVERTED', 'AUCTION'].includes(this.props.label) &&
      RN.Dimensions.get('window').width < 375

    return (
      <View
        style={styles.container}
        align="center"
        row
        bg={this.props.isOpen ? 'dark' : 'transparent'}
        py={1.25}
        px={1}
      >
        <Text
          opacity={1}
          weight="semibold"
          shadow
          size={shouldCondenseLabel ? 'xSmall' : 'small'}
          ls={shouldCondenseLabel ? 0 : 1.4}
          mr={0.5}
        >
          {this.props.label}
        </Text>
        <Svg viewBox="0 2 21 20" width="14" height="12">
          <G
            strokeLinecap="round"
            strokeWidth="2"
            fillRule="evenodd"
            stroke="white"
            fill="none"
          >
            <G rotation={this.props.isOpen ? '90' : '-90'} origin="10, 13">
              <Line x1="7" y1="13" x2="15" y2="5" />
              <Line x1="7" y1="14" x2="15" y2="22" />
            </G>
          </G>
        </Svg>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  }
})
