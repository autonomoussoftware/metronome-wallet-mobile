import { withNavigation, StackActions } from 'react-navigation'
import { withClient } from '../../shared/hocs/clientContext'
import * as utils from '../../shared/utils'
import CheckIcon from '../icons/CheckIcon'
import CloseIcon from '../icons/CloseIcon'
import PropTypes from 'prop-types'
import PinInput from './PinInput'
import React from 'react'
import View from './View'
import Text from './Text'
import Btn from './Btn'
import RN from 'react-native'

class Confirmation extends React.Component {
  static propTypes = {
    pendingParams: PropTypes.object,
    successParams: PropTypes.object,
    failureParams: PropTypes.object,
    pendingTitle: PropTypes.string,
    successTitle: PropTypes.string,
    failureTitle: PropTypes.string,
    successText: PropTypes.string,
    pendingText: PropTypes.string,
    client: PropTypes.shape({
      validatePIN: PropTypes.func.isRequired
    }),
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    pendingTitle: 'Sending...',
    successTitle: 'Success!',
    failureTitle: 'Error',
    pendingText: 'Waiting for transaction receipt...',
    successText:
      'You can view the status of this transaction in the transaction list.'
  }

  state = {
    password: '',
    status: 'confirm', // confirm | pending | success | failure
    result: null,
    error: null
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  onPasswordChange = ({ value }) => {
    this.setState({ password: value, error: null })
  }

  animationConfig = {
    duration: 300,
    create: {
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.linear
    },
    update: {
      duration: 200,
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.linear
    },
    delete: {
      duration: 200,
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.linear
    }
  }

  onPinComplete = () =>
    this.props.client
      .validatePIN(this.state.password)
      .then(this.onValidPIN)
      .catch(err =>
        this.setState({
          password: null,
          error: err.message || 'Unknown error'
        })
      )

  onValidPIN = () => {
    RN.LayoutAnimation.configureNext(this.animationConfig)
    this.setState({ status: 'pending' })

    if (this.props.pendingParams) {
      this.props.navigation.setParams(this.props.pendingParams)
    }

    this.props
      .onSubmit(this.state.password)
      .then(result => {
        RN.LayoutAnimation.configureNext(this.animationConfig)
        if (this._isMounted) {
          this.setState({ status: 'success', result })
        }
        if (this.props.successParams) {
          this.props.navigation.setParams(this.props.successParams)
        }
      })
      .catch(err => {
        RN.LayoutAnimation.configureNext(this.animationConfig)
        if (this._isMounted) {
          this.setState({ status: 'failure', error: err.message })
        }
        if (this.props.failureParams) {
          this.props.navigation.setParams(this.props.failureParams)
        }
      })
  }

  renderConfirmation = () => (
    <View withKeyboard withHeader flex={1} py={4} px={2}>
      {this.props.children}
      <View mt={4}>
        <PinInput
          shakeOnError
          onComplete={this.onPinComplete}
          onChange={this.onPasswordChange}
          label="Enter PIN to confirm"
          value={this.state.password || ''}
          error={this.state.error}
          id="password"
        />
      </View>
    </View>
  )

  renderPending = () => (
    <View flex={1} py={4} px={2}>
      <View grow={1} align="center" justify="center">
        <RN.ActivityIndicator size="large" />
        <Text size="medium" mt={2} mb={2} weight="semibold" align="center">
          {this.props.pendingText}
        </Text>
      </View>
    </View>
  )

  // Experimental: navigate to some route and hightlight an item
  // navigateAndHightLight(routeName, hightlightId) {
  //   this.props.navigation.navigate(
  //     routeName,
  //     {},
  //     StackActions.reset({
  //       index: 0,
  //       actions: [
  //         NavigationActions.navigate({
  //           routeName: routeName,
  //           params: { hightlightId }
  //         })
  //       ]
  //     })
  //   )
  // }

  renderSuccess = () => {
    const { successTitle, successText, navigation } = this.props
    return (
      <View flex={1} align="center" justify="center">
        <CheckIcon />
        <Text size="large" mt={2} weight="bold">
          {successTitle}
        </Text>
        {successText && (
          <Text size="medium" align="center" p={2}>
            {successText}
          </Text>
        )}
        <Btn
          onPress={() =>
            navigation.navigate('Dashboard', {}, StackActions.popToTop())
          }
          label="View Transactions"
          mt={1}
        />
      </View>
    )
  }

  renderFailure = () => {
    const messageWithReplacements = utils.messageParser(this.state.error)
    const defaultMessage = 'Something went wrong with your transaction.'

    return (
      <View flex={1} align="center" justify="center">
        <CloseIcon />
        <Text size="large" mt={2} weight="bold">
          {this.props.failureTitle}
        </Text>
        <Text size="medium" align="center" p={2}>
          {this.state.error === messageWithReplacements
            ? defaultMessage
            : messageWithReplacements}
        </Text>
        <Btn
          onPress={() => this.props.navigation.goBack()}
          label="Try Again"
          mt={1}
        />
      </View>
    )
  }

  render() {
    return (
      <View flex={1} bg="dark">
        {this.state.status === 'confirm' && this.renderConfirmation()}
        {this.state.status === 'success' && this.renderSuccess()}
        {this.state.status === 'failure' && this.renderFailure()}
        {this.state.status === 'pending' && this.renderPending()}
      </View>
    )
  }
}

export default withNavigation(withClient(Confirmation))
