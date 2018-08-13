import { default as Svg, G, Line } from 'react-native-svg'
import { TouchableOpacity } from 'react-native'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import React from 'react'

const backIcon = (
  <Svg key="back" viewBox="0 0 37 27" width="35" height="27">
    <G
      strokeLinecap="round"
      strokeWidth="2"
      fillRule="evenodd"
      stroke="white"
      fill="none"
    >
      <Line x1="12" y1="13" x2="20" y2="5" />
      <Line x1="12" y1="14" x2="20" y2="22" />
    </G>
  </Svg>
)

const menuIcon = (
  <Svg key="menu" viewBox="0 0 37 27" width="35" height="27">
    <G
      strokeLinecap="round"
      strokeWidth="2"
      fillRule="evenodd"
      stroke="white"
      fill="none"
    >
      <Line x1="8" y1="7" x2="29" y2="7" />
      <Line x1="8" y1="13.5" x2="29" y2="13.5" />
      <Line x1="8" y1="20" x2="29" y2="20" />
    </G>
  </Svg>
)

class LeftBtn extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    openDrawer: PropTypes.func.isRequired
  }

  getOnPress() {
    const handlersByPath = {
      '/converter/convert': () => this.props.history.push('/converter'),
      '/dashboard/receipt': () => this.props.history.push('/dashboard'),
      '/dashboard/receive': () => this.props.history.push('/dashboard'),
      '/dashboard/send': () => this.props.history.push('/dashboard'),
      '/auction/buy': () => this.props.history.push('/auction')
    }
    const index = Object.keys(handlersByPath).findIndex(
      path => this.props.location.pathname === path
    )
    return index >= 0
      ? Object.values(handlersByPath)[index]
      : this.props.openDrawer
  }

  getIcon() {
    const iconsByPath = {
      '/converter/convert': backIcon,
      '/dashboard/receipt': backIcon,
      '/dashboard/receive': backIcon,
      '/dashboard/send': backIcon,
      '/auction/buy': backIcon
    }
    const index = Object.keys(iconsByPath).findIndex(
      path => this.props.location.pathname === path
    )
    return index >= 0 ? Object.values(iconsByPath)[index] : menuIcon
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={this.getOnPress()}
      >
        {this.getIcon()}
      </TouchableOpacity>
    )
  }
}

export default withRouter(LeftBtn)
