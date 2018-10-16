import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

export default class TxIcon extends React.Component {
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
          d="M24 7.136v.96H1.642l4.464 4.464-.682.682-5.28-5.28a.475.475 0 0 1 0
             -.682L5.424 2l.682.682-4.464 4.464H24v-.01zM18.576 11.6l-.682.682
             4.464 4.464H0v.96h22.358l-4.464 4.464.682.681 5.28-5.28a.475.475 0
             0 0 0-.681l-5.28-5.29z"
        />
      </Svg>
    )
  }
}
