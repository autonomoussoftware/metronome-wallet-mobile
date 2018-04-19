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
      availableETH: PropTypes.string.isRequired,
      ETHprice: PropTypes.number.isRequired,
      client: PropTypes.shape({
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
      ethAmount: null,
      usdAmount: null,
      ...getInitialState('MET', this.props.client, this.props.config),
      estimate: null,
      errors: {}
    }

    state = this.initialState

    resetForm = () => this.setState(this.initialState)

    onInputChange = ({ id, value }) => {
      const { ETHprice, client } = this.props
      this.setState(state => ({
        ...state,
        ...utils.syncAmounts(state, ETHprice, id, value, client),
        errors: { ...state.errors, [id]: null },
        [id]: value
      }))

      // Estimate gas limit again if parameters changed
      if (['ethAmount'].includes(id)) this.getGasEstimate()
    }

    getGasEstimate = debounce(() => {
      const { ethAmount } = this.state

      if (!utils.isWeiable(ethAmount)) return

      this.props.client
        .getConvertEthGasLimit({
          value: this.props.client.toWei(utils.sanitize(ethAmount)),
          from: this.props.from
        })
        .then(({ gasLimit }) =>
          this.setState({ gasLimit: gasLimit.toString() })
        )
        .catch(err => console.warn('Gas estimation failed', err))
    }, 500)

    onWizardSubmit = password => {
      return this.props.client.convertEth({
        gasPrice: this.props.client.toWei(this.state.gasPrice, 'gwei'),
        gasLimit: this.state.gasLimit,
        password,
        value: this.props.client.toWei(utils.sanitize(this.state.ethAmount)),
        from: this.props.from
      })
    }

    validate = () => {
      const { ethAmount, gasPrice, gasLimit, client } = this.state
      const max = client.fromWei(this.props.availableETH)
      const errors = {
        ...validators.validateEthAmount(ethAmount, max),
        ...validators.validateGasPrice(gasPrice),
        ...validators.validateGasLimit(gasLimit)
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

export default withConvertETHtoMETState
