import { Svg, Path } from 'react-native-svg'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

export default class SelectorCaret extends React.Component {
  render() {
    return (
      <Svg viewBox="0 0 24 24" width="24" height="24" {...this.props}>
        <Path
          fill={theme.colors.light}
          d="M21 0H2C.9 0 0 .9 0 2v19c0 1.1.9 2 2 2h19c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm1 21c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h19c.55 0 1 .45 1 1v19zM16.65 8.65l.71.71-5.5 5.5a.485.485 0 0 1-.7 0l-5.5-5.5.71-.71 5.15 5.15 5.13-5.15z"
        />
      </Svg>
    )
  }
}
