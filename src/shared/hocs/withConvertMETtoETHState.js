import { getInitialState } from './withGasEditorState'
import * as validators from '../validators'
import * as selectors from '../selectors'
import { withClient } from './clientContext'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withConvertMETtoETHState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      converterPrice: PropTypes.string.isRequired,
      availableMET: PropTypes.string.isRequired,
      client: PropTypes.shape({
        getConvertMetEstimate: PropTypes.func.isRequired,
        getConvertMetGasLimit: PropTypes.func.isRequired,
        convertMet: PropTypes.func.isRequired,
        fromWei: PropTypes.func.isRequired,
        toWei: PropTypes.func.isRequired
      }).isRequired,
      config: PropTypes.shape({
        MET_DEFAULT_GAS_LIMIT: PropTypes.string.isRequired,
        DEFAULT_GAS_PRICE: PropTypes.string.isRequired
      }).isRequired,
      from: PropTypes.string.isRequired
    }

    static displayName = `withConvertMETtoETHState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    initialState = {
      ...getInitialState('MET', this.props.client, this.props.config),
      gasEstimateError: false,
      estimateError: null,
      metAmount: null,
      estimate: null,
      errors: {},
      rate: null
    }

    state = this.initialState

    resetForm = () => this.setState(this.initialState)

    componentDidUpdate({ converterPrice }, { metAmount }) {
      // Recalculate estimate if amount or price changed
      if (
        this.props.converterPrice !== converterPrice ||
        this.state.metAmount !== metAmount
      ) {
        this.getConversionEstimate()
      }
    }

    onInputChange = ({ id, value }) => {
      this.setState(state => ({
        ...state,
        gasEstimateError: id === 'gasLimit' ? false : state.gasEstimateError,
        errors: { ...state.errors, [id]: null },
        [id]: value
      }))

      // Estimate gas limit again if parameters changed
      if (['metAmount'].includes(id)) this.getGasEstimate()
    }

    getGasEstimate = debounce(() => {
      const { metAmount } = this.state

      if (!utils.isWeiable(this.props.client, metAmount)) return

      this.props.client
        .getConvertMetGasLimit({
          value: this.props.client.toWei(utils.sanitize(metAmount)),
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
      const { metAmount } = this.state
      const { client } = this.props

      if (
        !utils.isWeiable(client, metAmount) ||
        !utils.isGreaterThanZero(client, metAmount)
      ) {
        return this.setState({ estimateError: null, estimate: null })
      }
      client
        .getConvertMetEstimate({
          value: client.toWei(utils.sanitize(metAmount))
        })
        .then(({ result }) => {
          const rate = utils.getConversionRate(
            client,
            client.toWei(metAmount),
            result
          )
          this.setState({ estimateError: null, estimate: result, rate })
        })
        .catch(err => {
          this.setState({ estimateError: err.message, estimate: null })
        })
    }, 500)

    onSubmit = password => {
      return this.props.client.convertMet({
        gasPrice: this.props.client.toWei(this.state.gasPrice, 'gwei'),
        gas: this.state.gasLimit,
        password,
        value: this.props.client.toWei(utils.sanitize(this.state.metAmount)),
        from: this.props.from
      })
    }

    validate = () => {
      const { metAmount, gasPrice, gasLimit } = this.state
      const { client } = this.props
      const max = client.fromWei(this.props.availableMET)
      const errors = {
        ...validators.validateMetAmount(client, metAmount, max),
        ...validators.validateGasPrice(client, gasPrice),
        ...validators.validateGasLimit(client, gasLimit)
      }
      const hasErrors = Object.keys(errors).length > 0
      if (hasErrors) this.setState({ errors })
      return !hasErrors
    }

    onMaxClick = () => {
      const metAmount = this.props.client.fromWei(this.props.availableMET)
      this.onInputChange({ id: 'metAmount', value: metAmount })
    }

    render() {
      const amountFieldsProps = utils.getAmountFieldsProps({
        metAmount: this.state.metAmount
      })

      return (
        <WrappedComponent
          onInputChange={this.onInputChange}
          onMaxClick={this.onMaxClick}
          resetForm={this.resetForm}
          onSubmit={this.onSubmit}
          {...this.props}
          {...this.state}
          metPlaceholder={amountFieldsProps.metPlaceholder}
          metAmount={amountFieldsProps.metAmount}
          validate={this.validate}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    converterPrice: selectors.getConverterPrice(state),
    availableMET: selectors.getMtnBalanceWei(state),
    config: selectors.getConfig(state),
    from: selectors.getActiveWalletAddresses(state)[0]
  })

  return connect(mapStateToProps)(withClient(Container))
}

export default withConvertMETtoETHState
