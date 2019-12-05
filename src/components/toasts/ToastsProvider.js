import withToastsProviderState from 'metronome-wallet-ui-logic/src/hocs/withToastsProviderState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View } from '../common'
import Toast from './Toast'

class ToastsProvider extends React.Component {
  static propTypes = {
    messagesPerToast: PropTypes.number,
    onShowMoreClick: PropTypes.func.isRequired,
    onDismissClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    stack: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
  }

  render() {
    return (
      <View flex={1}>
        {this.props.children}
        <View style={styles.container}>
          {this.props.stack.map(([type, ...messages]) => (
            <Toast
              messagesPerToast={this.props.messagesPerToast}
              onShowMoreClick={this.props.onShowMoreClick}
              onDismissClick={this.props.onDismissClick}
              messages={messages}
              type={type}
              key={type}
            />
          ))}
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: '10%'
  }
})

function animation() {
  RN.LayoutAnimation.configureNext({
    duration: 300,
    create: {
      type: RN.LayoutAnimation.Types.easeIn,
      property: RN.LayoutAnimation.Properties.opacity
    },
    update: {
      type: RN.LayoutAnimation.Types.easeIn,
      property: RN.LayoutAnimation.Properties.opacity
    },
    delete: {
      type: RN.LayoutAnimation.Types.easeIn,
      property: RN.LayoutAnimation.Properties.opacity
    }
  })
}

export default withToastsProviderState(ToastsProvider, animation, animation)
