import { Svg, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

export default class WalletIcon extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired
  }

  render() {
    const { isActive, ...other } = this.props

    return (
      <Svg viewBox="0 0 24 24" width="24" height="24" {...other}>
        <Path
          opacity={isActive ? 1 : 0.5}
          fillRule="nonzero"
          fill={theme.colors.light}
          d="M19.2 13.52c0 .528-.432.96-.96.96a.963.963 0 0 1-.96-.96c0-.528.432
             -.96.96-.96s.96.432.96.96zm4.8-1.68v3.36c0 .576-.413 1.037-.96
             1.152V20a1.2 1.2 0 0 1-1.2 1.2H2.4A2.4 2.4 0 0 1 0 18.8V4.4c0-.634
             .25-1.238.7-1.7.462-.45 1.066-.7 1.7-.7h17.52a1.2 1.2 0 0 1 1.2 1.2
             v2.64h.72a1.2 1.2 0 0 1 1.2 1.2v3.648c.547.115.96.576.96 1.152zM.96
             4.4c0 .403.154.768.442 1.037.268.259.624.403.998.403h17.76v-.96
             H2.88v-.96h17.28V3.2a.238.238 0 0 0-.24-.24H2.4A1.439 1.439 0 0 0
             .96 4.4zm21.12 12h-3.84a2.882 2.882 0 0 1-2.88-2.88 2.882 2.882 0 0
             1 2.88-2.88h3.84v-3.6a.238.238 0 0 0-.24-.24H2.4a2.36 2.36 0 0 1
             -1.44-.5v12.5c0 .797.643 1.44 1.44 1.44h19.44c.134 0 .24-.106.24
             -.24v-3.6zm.96-4.56a.238.238 0 0 0-.24-.24h-4.56a1.923 1.923 0 0 0
             -1.891 2.246c.153.941 1.046 1.594 2.006 1.594h4.455c.134 0 .24-.106
             .24-.24v-3.36h-.01z"
        />
      </Svg>
    )
  }
}
