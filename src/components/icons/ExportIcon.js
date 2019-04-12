import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

export default class ExportIcon extends React.Component {
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
          transform="rotate(-180 12 12)"
          opacity={isActive === false ? 0.5 : 1}
          fill={theme.colors[color]}
          d="M7.67 18.384l3.973 3.984V6.72h.958v15.638l3.973-3.984.68.682-4.788 4.8a.473.473 0 0 1-.68 0L7 19.056l.67-.672zm-2.677-1.25A9.97 9.97 0 0 1 2 10C2 4.477 6.477 0 12 0s10 4.477 10 10a9.969 9.969 0 0 1-2.929 7.071l-.707-.707a9 9 0 1 0-12.649.078l-.722.692z"
        />
      </Svg>
    )
  }
}
