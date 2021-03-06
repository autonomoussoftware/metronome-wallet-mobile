import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import React from 'react'

import { View, Text } from '../common'
import DotIcon from '../icons/DotIcon'

const SecondaryNavBtn = ({ label, isActive, ...other }) => (
  <TouchableOpacity activeOpacity={0.5} {...other}>
    <View align="center" row py={1.5} px={2}>
      {isActive && <DotIcon />}
      <Text
        opacity={isActive ? 1 : 0.65}
        weight="semibold"
        color="light"
        size="medium"
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
)

SecondaryNavBtn.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired
}

export default SecondaryNavBtn
