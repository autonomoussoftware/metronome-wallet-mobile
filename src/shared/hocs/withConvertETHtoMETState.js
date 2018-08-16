import { getInitialState } from './withGasEditorState'
import * as validators from '../validators'
import * as selectors from '../selectors'
import { withClient } from './clientContext'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withConvertETHtoMETState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      converterPrice: PropTypes.string.isRequired,
      availableETH: PropTypes.string.isRequired,
      ETHprice: PropTypes.number.isRequired,
      client: PropTypes.shape({
        getConvertEthEstimate: PropTypes.func.isRequired,
        getConvertEthGasLimit: PropTypes.func.isRequired,
        convertEth: PropTypes.func.isRequired,
        fromWei: PropTypes.func.isRequired,
        toWei: PropTypes.func.isRequired
      }).isRequired,
      config: PropTypes.shape({
        MET_DEFAULT_GAS_LIMIT: PropTypes.string.isRequired,
        DEFAULT_GAS_PRICE: PropTypes.string.isRequired
      }).isRequired,
      from: PropTypes.string.isRequired
    }

    static displayName = `withConvertETHtoMETState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    initialState = {
      ...getInitialState('MET', this.props.client, this.props.config),
      gasEstimateError: false,
      estimateError: null,
      ethAmount: null,
      usdAmount: null,
      estimate: null,
      errors: {}
    }

    state = this.initialState

    resetForm = () => this.setState(this.initialState)

    componentDidUpdate({ converterPrice }, { ethAmount }) {
      // Recalculate estimate if amount or price changed
      if (
        this.props.converterPrice !== converterPrice ||
        this.state.ethAmount !== ethAmount
      ) {
        this.getConversionEstimate()
      }
    }

    onInputChange = ({ id, value }) => {
      const { ETHprice, client } = this.props
      this.setState(state => ({
        ...state,
        ...utils.syncAmounts(state, ETHprice, id, value, client),
        gasEstimateError: id === 'gasLimit' ? false : state.gasEstimateError,
        errors: { ...state.errors, [id]: null },
        [id]: value
      }))

      // Estimate gas limit again if parameters changed
      if (['ethAmount'].includes(id)) this.getGasEstimate()
    }

    getGasEstimate = debounce(() => {
      const { ethAmount } = this.state

      if (!utils.isWeiable(this.props.client, ethAmount)) return

      this.props.client
        .getConvertEthGasLimit({
          value: this.props.client.toWei(utils.sanitize(ethAmount)),
          from: this.props.from
        })
        .then(({ gasLimit }) =>
          this.setState({
            gasEstimateError: false,
            gasLimit: gasLimit.toString()
          })
        )
        .catch(() => this.setState({ gasEstimateError: true }))
    }, 500)

    getConversionEstimate = debounce(() => {
      const { ethAmount } = this.state
      const { client } = this.props

      if (
        !utils.isWeiable(client, ethAmount) ||
        !utils.isGreaterThanZero(client, ethAmount)
      ) {
        return this.setState({ estimateError: null, estimate: null })
      }
      client
        .getConvertEthEstimate({
          value: client.toWei(utils.sanitize(ethAmount))
        })
        .then(({ result }) => {
          this.setState({ estimateError: null, estimate: result })
        })
        .catch(err => {
          this.setState({ estimateError: err.message, estimate: null })
        })
    }, 500)

    onSubmit = password => {
      return this.props.client.convertEth({
        gasPrice: this.props.client.toWei(this.state.gasPrice, 'gwei'),
        gasLimit: this.state.gasLimit,
        password,
        value: this.props.client.toWei(utils.sanitize(this.state.ethAmount)),
        from: this.props.from
      })
    }

    validate = () => {
      const { ethAmount, gasPrice, gasLimit } = this.state
      const { client } = this.props
      const max = client.fromWei(this.props.availableETH)
      const errors = {
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
      const { ethAmount, usdAmount } = this.state

      return (
        <WrappedComponent
          onInputChange={this.onInputChange}
          onMaxClick={this.onMaxClick}
          resetForm={this.resetForm}
          onSubmit={this.onSubmit}
          {...this.props}
          {...this.state}
          ethPlaceholder={
            ethAmount === 'Invalid amount' ? 'Invalid amount' : '0.00'
          }
          usdPlaceholder={
            usdAmount === 'Invalid amount' ? 'Invalid amount' : '0.00'
          }
          ethAmount={ethAmount === 'Invalid amount' ? '' : ethAmount}
          usdAmount={usdAmount === 'Invalid amount' ? '' : usdAmount}
          validate={this.validate}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    converterPrice: selectors.getConverterPrice(state),
    availableETH: selectors.getEthBalanceWei(state),
    ETHprice: selectors.getEthRate(state),
    config: selectors.getConfig(state),
    from: selectors.getActiveWalletAddresses(state)[0]
  })

  return connect(mapStateToProps)(withClient(Container))
}

export default withConvertETHtoMETState
