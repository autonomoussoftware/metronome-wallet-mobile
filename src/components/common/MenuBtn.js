import { TouchableOpacity } from 'react-native'
import SVG, { G, Line } from 'react-native-svg'
import PropTypes from 'prop-types'
import React from 'react'

const MenuBtn = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.5}
    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
    onPress={onPress}
  >
    <SVG key="menu" viewBox="0 0 37 27" width="55" height="27">
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
    </SVG>
  </TouchableOpacity>
)

MenuBtn.propTypes = {
  onPress: PropTypes.func.isRequired
}

export default MenuBtn
