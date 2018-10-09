import { getInitialState } from './withGasEditorState'
import * as validators from '../validators'
import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withSendETHFormState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      availableETH: PropTypes.string.isRequired,
      ETHprice: PropTypes.number.isRequired,
      client: PropTypes.shape({
        getGasLimit: PropTypes.func.isRequired,
        isAddress: PropTypes.func.isRequired,
        sendEth: PropTypes.func.isRequired,
        fromWei: PropTypes.func.isRequired,
        toWei: PropTypes.func.isRequired
      }).isRequired,
      config: PropTypes.shape({
        MET_DEFAULT_GAS_LIMIT: PropTypes.string.isRequired,
        DEFAULT_GAS_PRICE: PropTypes.string.isRequired
      }).isRequired,
      from: PropTypes.string.isRequired
    }

    static displayName = `withSendETHFormState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    initialState = {
      ...getInitialState('ETH', this.props.client, this.props.config),
      gasEstimateError: false,
      toAddress: null,
      ethAmount: null,
      usdAmount: null,
      errors: {}
    }

    state = this.initialState

    resetForm = () => this.setState(this.initialState)

    onInputChange = ({ id, value }) => {
      const { ETHprice, client } = this.props
      this.setState(state => ({
        ...state,
        ...utils.syncAmounts(state, ETHprice, id, value, client),
        gasEstimateError: id === 'gasLimit' ? false : state.gasEstimateError,
        errors: { ...state.errors, [id]: null },
        [id]: utils.sanitizeInput(value)
      }))

      // Estimate gas limit again if parameters changed
      if (['ethAmount'].includes(id)) this.getGasEstimate()
    }

    getGasEstimate = debounce(() => {
      const { ethAmount, toAddress } = this.state

      if (
        !this.props.client.isAddress(toAddress) ||
        !utils.isWeiable(this.props.client, ethAmount)
      ) {
        return
      }

      this.props.client
        .getGasLimit({
          from: this.props.from,
          to: this.state.toAddress,
          value: this.props.client.toWei(utils.sanitize(ethAmount))
        })
        .then(({ gasLimit }) =>
          this.setState({
            gasEstimateError: false,
            gasLimit: gasLimit.toString()
          })
        )
        .catch(() => this.setState({ gasEstimateError: true }))
    }, 500)

    onSubmit = password =>
      this.props.client.sendEth({
        gasPrice: this.props.client.toWei(this.state.gasPrice, 'gwei'),
        gas: this.state.gasLimit,
        password,
        value: this.props.client.toWei(utils.sanitize(this.state.ethAmount)),
        from: this.props.from,
        to: this.state.toAddress
      })

    validate = () => {
      const { ethAmount, toAddress, gasPrice, gasLimit } = this.state
      const { client } = this.props
      const max = client.fromWei(this.props.availableETH)
      const errors = {
        ...validators.validateToAddress(client, toAddress),
        ...validators.validateEthAmount(client, ethAmount, max),
        ...validators.validateGasPrice(client, gasPrice),
        ...validators.validateGasLimit(client, gasLimit)
      }
      const hasErrors = Object.keys(errors).length > 0
      if (hasErrors) this.setState({ errors })
      return !hasErrors
    }

    onMaxClick = () => {
      const ethAmount = this.props.client.fromWei(this.props.availableETH)
      this.onInputChange({ id: 'ethAmount', value: ethAmount })
    }

    render() {
      const amountFieldsProps = utils.getAmountFieldsProps({
        ethAmount: this.state.ethAmount,
        usdAmount: this.state.usdAmount
      })

      return (
        <WrappedComponent
          onInputChange={this.onInputChange}
          onMaxClick={this.onMaxClick}
          resetForm={this.resetForm}
          onSubmit={this.onSubmit}
          {...this.props}
          {...this.state}
          ethPlaceholder={amountFieldsProps.ethPlaceholder}
          usdPlaceholder={amountFieldsProps.usdPlaceholder}
          ethAmount={amountFieldsProps.ethAmount}
          usdAmount={amountFieldsProps.usdAmount}
          validate={this.validate}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    availableETH: selectors.getEthBalanceWei(state),
    ETHprice: selectors.getEthRate(state),
    config: selectors.getConfig(state),
    from: selectors.getActiveWalletAddresses(state)[0]
  })

  return connect(mapStateToProps)(withClient(Container))
}

export default withSendETHFormState
