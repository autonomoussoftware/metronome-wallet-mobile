import { withNavigation, StackActions } from 'react-navigation'
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

  onPasswordChange = ({ value }) => this.setState({ password: value })

  animationConfig = {
    duration: 300,
    create: {
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.spring
    },
    update: {
      duration: 200,
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.spring
    },
    delete: {
      duration: 200,
      property: RN.LayoutAnimation.Properties.opacity,
      type: RN.LayoutAnimation.Types.linear
    }
  }

  onPinComplete = () => {
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

  renderConfirmation = () => {
    return (
      <View bg="dark" py={4} px={2} flex={1}>
        <View grow={1}>
          {this.props.children}
          <View mt={4}>
            <PinInput
              onComplete={this.onPinComplete}
              onChange={this.onPasswordChange}
              label="Enter PIN to confirm"
              value={this.state.password}
              id="password"
            />
          </View>
        </View>
      </View>
    )
  }

  renderPending = () => {
    return (
      <View flex={1} bg="dark" py={4} px={2}>
        <View grow={1} align="center" justify="center">
          <RN.ActivityIndicator size="large" />
          <Text size="medium" mt={2} mb={2} weight="semibold" align="center">
            {this.props.pendingText}
          </Text>
        </View>
      </View>
    )
  }

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
      <View flex={1} align="center" justify="center" bg="dark">
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
    return (
      <View flex={1} align="center" justify="center" bg="dark">
        <CloseIcon />
        <Text size="large" mt={2} weight="bold">
          {this.props.failureTitle}
        </Text>
        {this.state.error && (
          <Text size="medium" align="center" p={2}>
            {this.state.error}
          </Text>
        )}
        <Btn
          onPress={() => this.props.navigation.goBack()}
          label="Try Again"
          mt={1}
        />
      </View>
    )
  }

  render() {
    switch (this.state.status) {
      case 'confirm':
        return this.renderConfirmation()
      case 'success':
        return this.renderSuccess()
      case 'failure':
        return this.renderFailure()
      case 'pending':
        return this.renderPending()
      default:
        return null
    }
  }
}

export default withNavigation(Confirmation)
