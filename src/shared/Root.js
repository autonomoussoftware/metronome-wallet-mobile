import { withClient } from './hocs/clientContext'
import * as selectors from './selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

class Root extends React.Component {
  static propTypes = {
    OnboardingComponent: PropTypes.func.isRequired,
    LoadingComponent: PropTypes.func.isRequired,
    RouterComponent: PropTypes.func.isRequired,
    isSessionActive: PropTypes.bool.isRequired,
    LoginComponent: PropTypes.func.isRequired,
    hasEnoughData: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    client: PropTypes.shape({
      onOnboardingCompleted: PropTypes.func.isRequired,
      onLoginSubmit: PropTypes.func.isRequired,
      onInit: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    onboardingComplete: null
  }

  componentDidMount() {
    this.props.client
      .onInit()
      .then(({ onboardingComplete }) => {
        this.setState({ onboardingComplete })
      })
      .catch(console.error) // eslint-disable-line
  }

  onOnboardingCompleted = ({ password, mnemonic }) => {
    return this.props.client
      .onOnboardingCompleted({
        password,
        mnemonic
      })
      .then(() => {
        this.setState({ onboardingComplete: true })
        this.props.dispatch({ type: 'session-started' })
      })
      .catch(console.error) // eslint-disable-line
  }

  onLoginSubmit = ({ password }) => {
    return this.props.client
      .onLoginSubmit({ password })
      .then(() => this.props.dispatch({ type: 'session-started' }))
  }

  render() {
    const {
      OnboardingComponent,
      LoadingComponent,
      RouterComponent,
      isSessionActive,
      LoginComponent,
      hasEnoughData
    } = this.props

    const { onboardingComplete } = this.state

    if (onboardingComplete === null) return null

    return !onboardingComplete ? (
      <OnboardingComponent onOnboardingCompleted={this.onOnboardingCompleted} />
    ) : !isSessionActive ? (
      <LoginComponent onLoginSubmit={this.onLoginSubmit} />
    ) : !hasEnoughData ? (
      <LoadingComponent />
    ) : (
      <RouterComponent />
    )
  }
}

const mapStateToProps = state => ({
  isSessionActive: selectors.isSessionActive(state),
  hasEnoughData: selectors.hasEnoughData(state)
})

export default connect(mapStateToProps)(withClient(Root))
