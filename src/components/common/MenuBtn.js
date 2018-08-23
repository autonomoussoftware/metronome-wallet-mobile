import { default as Svg, G, Line } from 'react-native-svg'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import React from 'react'

export const backIcon = (
  <Svg key="back" viewBox="0 0 37 27" width="35" height="27">
    <G
      strokeLinecap="round"
      strokeWidth="2"
      fillRule="evenodd"
      stroke="white"
      fill="none"
    >
      <Line x1="12" y1="13" x2="20" y2="5" />
      <Line x1="12" y1="14" x2="20" y2="22" />
    </G>
  </Svg>
)

const MenuBtn = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
    onPress={onPress}
  >
    <Svg key="menu" viewBox="0 0 37 27" width="55" height="27">
      <G
        strokeLinecap="round"
        strokeWidth="2"
        fillRule="evenodd"
        stroke="white"
        fill="none"
      >
        <Line x1="8" y1="7" x2="29" y2="7" />
        <Line x1="8" y1="13.5" x2="29" y2="13.5" />
        <Line x1="8" y1="20" x2="29" y2="20" />
      </G>
    </Svg>
  </TouchableOpacity>
)

MenuBtn.propTypes = {
  onPress: PropTypes.func.isRequired
}

export default MenuBtn
