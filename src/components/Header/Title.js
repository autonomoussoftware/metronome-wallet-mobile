import { withRouter } from 'react-router'
import { View, Text } from '../common'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

const titlesByPath = {
  '/wallets/receipt': 'Transaction Receipt',
  '/wallets/receive': 'Receive',
  '/wallets/send': 'Send',
  '/wallets': 'My wallet',

  '/auction': 'Auction',
  '/auction/buy': 'Buy Metronome',

  '/converter': 'Autonomous Converter',
  '/converter/convert': 'Convert',

  '/settings': 'Settings',
  '/tools': 'Recover wallet',
  '/help': 'Help'
}

function getPageTitleFromPath(props) {
  const index = Object.keys(titlesByPath).findIndex(
    path => props.location.pathname === path
  )
  return index >= 0 ? Object.values(titlesByPath)[index] : ''
}

class Title extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  }

  state = { title: '' }

  static getDerivedStateFromProps(props, prevState) {
    const newPathTitle = getPageTitleFromPath(props)

    // Avoid updating anything if title didn't change
    if (newPathTitle === prevState.title) return null

    // Schedule an animation for the title update
    RN.LayoutAnimation.easeInEaseOut()

    return { title: newPathTitle }
  }

  render() {
    const { title } = this.state

    return (
      <View justify="center" align="center" grow={1} mr={4} px={1}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          weight="bold"
          shadow
          color="light"
          size="large"
          key={title} // We need to re-mount the title for the animation to work
        >
          {title}
        </Text>
      </View>
    )
  }
}

export default withRouter(Title)
