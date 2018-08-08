import { spacing } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'
import Text from './Text'
import View from './View'
import RN from 'react-native'

const Btn = props => {
  const { style, label, block, disabled, ...other } = props

  return (
    <RN.TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[block && styles.block, spacing(props), style]}
      {...other}
    >
      <View style={styles.container} bg="xLight" opacity={disabled ? 0.5 : 1}>
        <Text
          weight="semibold"
          size="large"
          color="primary"
          px={4}
          py={2}
          align="center"
        >
          {label}
        </Text>
      </View>
    </RN.TouchableOpacity>
  )
}

Btn.propTypes = {
  label: PropTypes.string.isRequired,
  block: PropTypes.bool,
  style: PropTypes.any,
  ...spacing.propTypes
}

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 12
  },
  block: {
    width: '100%'
  }
})

export default Btn
