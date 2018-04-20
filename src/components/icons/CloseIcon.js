import { default as Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

export default class CloseIcon extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
  }

  render() {
    const { color = 'danger', size = '48', ...other } = this.props

    return (
      <Svg viewBox="0 0 24 24" width={size} height={size} {...other}>
        <Path
          fill={theme.colors[color]}
          d="M12 24C5.386 24 0 18.614 0 12S5.386 0 12 0s12 5.386 12 12-5.386 12-12 12zM12 .96C5.914.96.96 5.914.96 12c0 6.086 4.954 11.04 11.04 11.04 6.086 0 11.04-4.954 11.04-11.04C23.04 5.914 18.086.96 12 .96zm3.984 15.696L12 12.672l-3.984 3.984-.682-.682 3.984-3.984-3.984-3.984.682-.681L12 11.309l3.984-3.984.682.681-3.984 3.984 3.984 3.984-.682.682z"
        />
      </Svg>
    )
  }
}
