import PropTypes from 'prop-types'
import { View } from '../common'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

const Spinner = ({ size = 22, ...other }) =>
  RN.Platform.OS === 'android' ? (
    <View
      style={[
        styles.container,
        {
          borderRadius: size * 1.1,
          height: size * 1.1,
          width: size * 1.1
        }
      ]}
    >
      <RN.ActivityIndicator
        color={theme.colors.primary}
        size={size}
        {...other}
      />
    </View>
  ) : (
    <RN.ActivityIndicator
      color={theme.colors.primary}
      size={size < 16 ? 'small' : 'large'}
      {...other}
    />
  )

Spinner.propTypes = {
  size: PropTypes.number
}

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: theme.colors.darkShade
  }
})

export default Spinner
