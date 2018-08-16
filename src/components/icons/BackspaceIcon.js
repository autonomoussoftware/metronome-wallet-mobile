import { default as Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

export default class BackspaceIcon extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
  }

  render() {
    const { color = 'primary', size = '25', ...other } = this.props

    return (
      <Svg viewBox="0 0 48 48" width={size} height={size} {...other}>
        <Path d="M0 0h48v48h-48z" fill="none" />
        <Path
          fill={theme.colors[color]}
          d="M44 6h-30c-1.38 0-2.47.7-3.19 1.76l-10.81 16.23 10.81 
             16.23c.72 1.06 1.81 1.78 3.19 1.78h30c2.21 0 4-1.79
             4-4v-28c0-2.21-1.79-4-4-4zm-6 25.17l-2.83 2.83-7.17-7.17-7.17
             7.17-2.83-2.83 7.17-7.17-7.17-7.17 2.83-2.83 7.17 7.17
             7.17-7.17 2.83 2.83-7.17 7.17 7.17 7.17z"
        />
      </Svg>
    )
  }
}
