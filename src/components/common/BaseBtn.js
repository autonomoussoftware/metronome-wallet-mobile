import { TouchableOpacity } from 'react-native'
import { spacing, sizes } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'
import Text from './Text'

const BaseBtn = props => {
  const { style, label, size, textProps, ...other } = props

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[spacing(props), style]}
      {...other}
    >
      <Text color="light" size={size} {...textProps}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

BaseBtn.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  ...spacing.propTypes,
  ...sizes.propTypes
}

export default BaseBtn
