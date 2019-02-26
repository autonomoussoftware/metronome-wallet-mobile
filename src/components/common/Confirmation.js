import { withNavigation, StackActions } from 'react-navigation'
import FilteredMessage from 'metronome-wallet-ui-logic/src/components/FilteredMessage'
import { withClient } from 'metronome-wallet-ui-logic/src/hocs/clientContext'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import CloseIcon from '../icons/CloseIcon'
import PinInput from './PinInput'
import Receipt from './receipt/Receipt'
import View from './View'
import Text from './Text'
import Btn from './Btn'

/**
 * Android currently does not support SafeAreaView,
 * but the notch is hidden within the status bar
 * in this particular screen by default, so it isn't needed.
 */
const supportsSafeView =
  RN.Platform.OS === 'ios' && parseInt(RN.Platform.Version, 10) >= 11

class Confirmation extends React.Component {
  static propTypes = {
    pendingTitle: PropTypes.string,
    pendingText: PropTypes.string,
    navigation: PropTypes.shape({
      popToTop: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired
    }).isRequired,
    noReceipt: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    client: PropTypes.shape({
      validatePIN: PropTypes.func.isRequired
    }).isRequired
  }

  static defaultProps = {
    pendingTitle: 'Waiting for receipt...'
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

  onPinComplete = () => {
    this.props.client
      .validatePIN(this.state.password)
      .then(this.onValidPIN)
      .catch(err =>
        this.setState({
          password: null,
          error: err.message || 'Unknown error'
        })
      )
  }

  onValidPIN = () => {
    RN.LayoutAnimation.configureNext(this.animationConfig)
    this.setState({ status: 'pending' })
    this.props
      .onSubmit(this.state.password)
      .then(this.onSuccess)
      .catch(this.onFailure)
  }

  onSuccess = result => {
    if (this._isMounted) {
      RN.LayoutAnimation.configureNext(this.animationConfig)
      this.setState({ status: 'success', result })
    }
  }

  onFailure = err => {
    if (this._isMounted) {
      RN.LayoutAnimation.configureNext(this.animationConfig)
      this.setState({ status: 'failure', error: err.message })
    }
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

  navigateToDashboard = () => {
    this.props.navigation.navigate('Dashboard', {}, StackActions.popToTop())
  }

  renderPending = () => (
    <View flex={1} py={4} px={2} align="center" justify="center">
      <RN.ActivityIndicator size="large" />
      <Text size="medium" mt={2} mb={1} weight="semibold" align="center">
        {this.props.pendingTitle}
      </Text>
      {this.props.pendingText ? (
        <Text size="small" mb={3} align="center" opacity={0.8} mw={260}>
          {this.props.pendingText}
        </Text>
      ) : (
        <React.Fragment>
          <Text size="small" mb={3} align="center" opacity={0.8} mw={260}>
            You can follow this transaction status from the Dashboard.
          </Text>
          <Btn onPress={this.navigateToDashboard} label="Go to Dashboard" />
        </React.Fragment>
      )}
    </View>
  )

  renderFailure = () => (
    <View flex={1} align="center" justify="center">
      <CloseIcon />
      <Text size="large" mt={2} weight="bold">
        Error
      </Text>
      <Text size="medium" align="center" p={2}>
        <FilteredMessage>this.state.error</FilteredMessage>
      </Text>
      <Btn
        onPress={() => this.props.navigation.goBack()}
        label="Try Again"
        mt={1}
      />
    </View>
  )

  closeReceiptModal = () => {
    this.setState({ status: 'pending' })
    this.props.navigation.popToTop()
  }

  renderReceiptModal = () => (
    <RN.Modal
      onRequestClose={this.closeReceiptModal}
      animationType="slide"
      transparent={false}
      visible={this.state.status === 'success'}
    >
      <View flex={1} bg="primary">
        <RN.SafeAreaView style={styles.safeArea}>
          <View
            justify="space-between"
            align="center"
            row
            bg="primary"
            px={2}
            pt={supportsSafeView ? 2 : 4}
            pb={2}
          >
            <View shrink={1}>
              <Text size="medium" weight="bold">
                Transaction Receipt
              </Text>
            </View>
            <View ml={2}>
              <RN.TouchableOpacity onPress={this.closeReceiptModal}>
                <CloseIcon size="20" color="light" />
              </RN.TouchableOpacity>
            </View>
          </View>
          {this.state.status === 'success' && (
            <Receipt
              navigation={this.props.navigation}
              hash={this.state.result.receipt.transactionHash}
            />
          )}
        </RN.SafeAreaView>
      </View>
    </RN.Modal>
  )

  render() {
    return (
      <View flex={1} bg="dark">
        {this.state.status === 'confirm' && this.renderConfirmation()}
        {this.state.status === 'pending' && this.renderPending()}
        {this.state.status === 'failure' && this.renderFailure()}
        {!this.props.noReceipt && this.renderReceiptModal()}
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  safeArea: { flex: 1 }
})

export default withNavigation(withClient(Confirmation))
