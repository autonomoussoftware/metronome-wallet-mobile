import { default as Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

export default class CheckIcon extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
  }

  render() {
    const { color = 'success', size = '48', ...other } = this.props

    return (
      <Svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        {...other}
      >
        <Path
          fill={theme.colors[color]}
          d="M24 48C10.771 48 0 37.229 0 24S10.771 0 24 0s24 10.771 24 24-10.771 24-24 24zm0-46.08C11.827 1.92 1.92 11.827 1.92 24c0 12.173 9.907 22.08 22.08 22.08 12.173 0 22.08-9.907 22.08-22.08 0-12.173-9.907-22.08-22.08-22.08zm-3.86 30.72a.9.9 0 0 1-.671-.288l-6.701-6.7 1.363-1.364 6.01 6.01L35.789 14.65l1.363 1.363-16.34 16.339a.932.932 0 0 1-.671.288z"
        />
      </Svg>
    )
  }
}
