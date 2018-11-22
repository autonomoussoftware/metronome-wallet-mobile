import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

export default class RefreshControl extends React.Component {
  render() {
    const { ...other } = this.props

    return (
      <RN.RefreshControl
        // iOS only
        tintColor={theme.colors.light}
        // Android only
        colors={[theme.colors.primary]}
        size={39}
        {...other}
      />
    )
  }
}
