import SVG, { Path } from 'react-native-svg'
import theme from '../../theme'
import React from 'react'

export default class CopyIcon extends React.Component {
  render() {
    return (
      <SVG viewBox="0 0 24 24" width="24" height="24" {...this.props}>
        <Path
          fill={theme.colors.light}
          d="M15.437 3.75h-2.75v-1.375c0-0.756-0.619-1.375-1.375-1.375h-2.75c-0.756 0-1.375 0.619-1.375 1.375v1.375h-2.75v2.75h11v-2.75zM11.312 3.75h-2.75v-1.373c0.001-0.001 0.002-0.002 0.002-0.002h2.745c0.001 0.001 0.002 0.002 0.003 0.002v1.373zM18.187 7.875v-3.437c0-0.378-0.309-0.688-0.688-0.688h-1.375v1.375h0.688v2.75h-4.125l-4.125 4.125v5.5h-5.5v-12.375h0.688v-1.375h-1.375c-0.378 0-0.688 0.309-0.688 0.688v13.75c0 0.378 0.309 0.688 0.688 0.688h6.188v4.125h13.75v-15.125h-4.125zM12.687 9.82v2.18h-2.18l2.18-2.18zM20.937 21.625h-11v-8.25h4.125v-4.125h6.875v12.375z"
        />
      </SVG>
    )
  }
}
