import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../common'
import CloseIcon from '../icons/CloseIcon'
import theme from 'metronome-wallet-ui-logic/src/theme'

export default class Toast extends React.Component {
  static propTypes = {
    messagesPerToast: PropTypes.number.isRequired,
    onShowMoreClick: PropTypes.func.isRequired,
    onDismissClick: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.oneOf(['info', 'success', 'error']).isRequired
  }

  state = { showMore: false }

  handleDismiss = () => this.props.onDismissClick(this.props.type)

  handleShowMore = () => {
    RN.LayoutAnimation.easeInEaseOut()
    this.setState({ showMore: true })
    // cancel autoClose
    this.props.onShowMoreClick(this.props.type)
  }

  render() {
    const shownMessages = this.state.showMore
      ? this.props.messages
      : this.props.messages.slice(0, this.props.messagesPerToast)

    const hiddenMessages = this.state.showMore
      ? []
      : this.props.messages.slice(this.props.messagesPerToast)

    return (
      <View
        shadowOpacity={0.5}
        shadowOffset={{ height: 10 }}
        shadowRadius={12}
        shadowColor="#000"
        style={[styles.container, styles[this.props.type]]}
        row
        mt={1}
      >
        <View
          contentContainerStyle={styles.textContainer}
          alwaysBounceVertical={false}
          scroll
          style={styles.scrollContainer}
          basis={0}
          grow={1}
          pl={2}
        >
          {(hiddenMessages.length > 0
            ? [...shownMessages, 'more']
            : shownMessages
          ).map(msg =>
            msg === 'more' ? (
              <RN.TouchableOpacity onPress={this.handleShowMore} key={msg}>
                <Text
                  opacity={0.6}
                  weight="semibold"
                  shadow
                  size="xSmall"
                  py={1}
                  ls={2}
                >
                  VIEW {hiddenMessages.length} MORE{' '}
                  {hiddenMessages.length > 1 ? 'MESSAGES' : 'MESSAGE'}
                </Text>
              </RN.TouchableOpacity>
            ) : (
              <Text key={msg} size="medium" weight="light" py={1}>
                {msg}
              </Text>
            )
          )}
        </View>
        <View shrink={0}>
          <RN.TouchableOpacity
            onPress={this.handleDismiss}
            style={styles.closeBtn}
          >
            <CloseIcon size="24" color="light" />
          </RN.TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: '#545454',
    borderTopWidth: 4,
    borderTopColor: theme.colors.primary,
    elevation: 8
  },
  success: {
    borderTopColor: theme.colors.success
  },
  error: {
    borderTopColor: theme.colors.danger
  },
  closeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  scrollContainer: {
    maxHeight: 245
  },
  textContainer: {
    paddingVertical: 8
  }
})
