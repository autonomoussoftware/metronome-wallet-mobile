import { Svg, G, Line } from 'react-native-svg'
import PropTypes from 'prop-types'
import React from 'react'

export default class CaretIcon extends React.Component {
  static propTypes = {
    up: PropTypes.bool
  }

  static defaultProps = {
    up: false
  }

  render() {
    const { up, ...other } = this.props

    return (
      <Svg viewBox="0 2 21 20" width="14" height="12" {...other}>
        <G
          strokeLinecap="round"
          strokeWidth="2"
          fillRule="evenodd"
          stroke="white"
          fill="none"
        >
          <G rotation={up ? '90' : '-90'} origin="10, 13">
            <Line x1="7" y1="13" x2="15" y2="5" />
            <Line x1="7" y1="14" x2="15" y2="22" />
          </G>
        </G>
      </Svg>
    )
  }
}
