import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

// Time to wait before updating checklist status (in ms)
// The idea is to prevent fast-loading checklists which would look like a glitch
const MIN_CADENCE = 200

// Time to wait before exiting the loading screen (in ms)
const ON_COMPLETE_DELAY = 20

const withLoadingState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      hasBlockHeight: PropTypes.bool.isRequired,
      hasEthBalance: PropTypes.bool.isRequired,
      hasMetBalance: PropTypes.bool.isRequired,
      hasEthRate: PropTypes.bool.isRequired,
      onComplete: PropTypes.func.isRequired
    }

    static displayName = `withLoadingState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      hasBlockHeight: false,
      hasEthBalance: false,
      hasMetBalance: false,
      hasEthRate: false
    }

    checkFinished = () => {
      const {
        hasBlockHeight,
        hasEthBalance,
        hasMetBalance,
        hasEthRate
      } = this.state

      if (hasBlockHeight && hasEthBalance && hasMetBalance && hasEthRate) {
        clearInterval(this.interval)
        setTimeout(this.props.onComplete, ON_COMPLETE_DELAY)
      }
    }

    checkTasks = () => {
      const {
        hasBlockHeight,
        hasEthBalance,
        hasMetBalance,
        hasEthRate
      } = this.state

      if (this.props.hasBlockHeight && !hasBlockHeight) {
        return this.setState({ hasBlockHeight: true }, this.checkFinished)
      }
      if (this.props.hasEthRate && !hasEthRate) {
        return this.setState({ hasEthRate: true }, this.checkFinished)
      }
      if (this.props.hasEthBalance && !hasEthBalance) {
        return this.setState({ hasEthBalance: true }, this.checkFinished)
      }
      if (this.props.hasMetBalance && !hasMetBalance) {
        return this.setState({ hasMetBalance: true }, this.checkFinished)
      }
    }

    componentDidMount() {
      this.interval = setInterval(this.checkTasks, MIN_CADENCE)
    }

    componentWillUnmount() {
      if (this.interval) clearInterval(this.interval)
    }

    render() {
      return (
        <WrappedComponent
          hasBlockHeight={this.state.hasBlockHeight}
          hasEthBalance={this.state.hasEthBalance}
          hasMetBalance={this.state.hasMetBalance}
          hasEthRate={this.state.hasEthRate}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    hasBlockHeight: selectors.getBlockHeight(state) !== null,
    hasEthBalance: selectors.getActiveWalletEthBalance(state) !== null,
    hasMetBalance: selectors.getActiveWalletMtnBalance(state) !== null,
    hasEthRate: selectors.getEthRate(state) !== null
  })

  const mapDispatchToProps = dispatch => ({
    onComplete: () => dispatch({ type: 'required-data-gathered' })
  })
  return connect(mapStateToProps, mapDispatchToProps)(Container)
}

export default withLoadingState
