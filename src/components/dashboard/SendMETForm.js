import { GasEditor, TextInput, BaseBtn, View } from '../common'
import withSendMETFormState from '../../shared/hocs/withSendMETFormState'
import { withNavigation } from 'react-navigation'
import QRScanner from './QRScanner'
import PropTypes from 'prop-types'
import React from 'react'

class SendMETForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    metPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    toAddress: PropTypes.string,
    metAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    errors: PropTypes.object.isRequired
  }

  state = { isQRscannerVisible: false }

  componentDidMount() {
    this.props.navigation.setParams({
      onHeaderRightPress: this.onHeaderRightPress
    })
  }

  onHeaderRightPress = () => {
    const { navigation, validate, ...other } = this.props
    if (validate()) {
      navigation.navigate('ConfirmSendMET', other)
    }
  }

  onCloseScanQR = () => this.setState({ isQRscannerVisible: false })

  onScanQRPress = () => this.setState({ isQRscannerVisible: true })

  onQRcodeRead = e => {
    this.props.onInputChange({ id: 'toAddress', value: e.data })
    this.setState({ isQRscannerVisible: false })
  }

  render() {
    return (
      <View flex={1} px={2} pt={3} pb={4}>
        <TextInput
          placeholder="e.g. 0x2345678998765434567"
          postLabel={
            <BaseBtn
              textProps={{ opacity: 0.8, weight: 'semibold' }}
              onPress={this.onScanQRPress}
              label="SCAN QR"
              size="xSmall"
            />
          }
          onChange={this.props.onInputChange}
          error={this.props.errors.toAddress}
          label="Send to Address"
          value={this.props.toAddress}
          id="toAddress"
        />
        <View my={3}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder={this.props.metPlaceholder}
            postLabel={
              <BaseBtn
                textProps={{ opacity: 0.8, weight: 'semibold' }}
                onPress={this.props.onMaxClick}
                label="MAX"
                size="xSmall"
              />
            }
            onChange={this.props.onInputChange}
            error={this.props.errors.metAmount}
            label="Amount (MET)"
            value={this.props.metAmount}
            id="metAmount"
          />
        </View>
        <GasEditor
          gasEstimateError={this.props.gasEstimateError}
          onInputChange={this.props.onInputChange}
          useCustomGas={this.props.useCustomGas}
          gasLimit={this.props.gasLimit}
          gasPrice={this.props.gasPrice}
          errors={this.props.errors}
        />

        <QRScanner
          isVisible={this.state.isQRscannerVisible}
          onClose={this.onCloseScanQR}
          onRead={this.onQRcodeRead}
        />
      </View>
    )
  }
}

export default withSendMETFormState(withNavigation(SendMETForm))
