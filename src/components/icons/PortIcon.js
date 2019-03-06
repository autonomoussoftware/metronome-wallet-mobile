import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

export default class PortIcon extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string
  }

  render() {
    const { isActive, color = 'light', size = '24', ...other } = this.props

    return (
      <Svg viewBox="0 0 24 24" width={size} height={size} {...other}>
        <Path
          opacity={isActive === false ? 0.5 : 1}
          fill={theme.colors[color]}
          d="M16.583 11.616L12.61 7.632V23.28h-.957V7.642L7.68 11.626 7 10.944l4.787-4.8a.473.473 0 0 1 .68 0l4.786 4.8-.67.672zM10 20.8c-4.564-.927-8-4.962-8-9.8C2 5.477 6.477 1 12 1s10 4.477 10 10c0 4.838-3.436 8.873-8 9.8v-1.023a9 9 0 1 0-4 0V20.8z"
        />
      </Svg>
    )
  }
}
