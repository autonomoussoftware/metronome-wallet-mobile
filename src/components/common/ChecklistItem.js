import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import React from 'react'

import Text from './Text'
import View from './View'

export default class ChecklistItem extends React.Component {
  static propTypes = {
    isCondensed: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }

  render() {
    return (
      <View row align="center" p={this.props.isCondensed ? 0.5 : 0.75}>
        <Svg
          viewBox="0 0 24 24"
          height={this.props.isCondensed ? '16' : '24'}
          width={this.props.isCondensed ? '16' : '24'}
        >
          <Path
            fill={this.props.isActive ? '#45d48d' : '#7d7f89'}
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12
               2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88
               -11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39
               .39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03
               -.39-1.42 0z"
          />
        </Svg>
        <Text
          opacity={this.props.isActive ? 1 : 0.7}
          weight="semibold"
          size={this.props.isCondensed ? 'small' : 'medium'}
          ml={this.props.isCondensed ? 1 : 1.5}
        >
          {this.props.text}
        </Text>
      </View>
    )
  }
}
