import withPortFormState from 'metronome-wallet-ui-logic/src/hocs/withPortFormState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import ReadOnlyField from './ReadOnlyField'
import {
  DisplayValue,
  TextInput,
  GasEditor,
  Selector,
  BaseBtn,
  View,
  Text
} from '../common'

class PortDrawer extends React.Component {
  static propTypes = {
    availableDestinations: PropTypes.arrayOf(
      PropTypes.shape({
        disabledReason: PropTypes.string,
        address: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    sourceDisplayName: PropTypes.string.isRequired,
    gasEstimateError: PropTypes.bool,
    onInputChange: PropTypes.func.isRequired,
    availableMet: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    destination: PropTypes.string.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    metAmount: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    feeError: PropTypes.string,
    errors: PropTypes.object.isRequired,
    fee: PropTypes.string
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onHeaderRightPress: this.onHeaderRightPress
    })
  }

  onHeaderRightPress = () => {
    const { navigation, validate, ...other } = this.props
    if (validate()) {
      RN.Keyboard.dismiss()
      navigation.navigate('ConfirmPort', other)
    }
  }

  render() {
    return (
      <View withKeyboard bg="dark">
        <View flex={1} px={2} py={4} grow={1}>
          <ReadOnlyField
            suffix={
              <DisplayValue
                weight="semibold"
                value={this.props.availableMet}
                color="primary"
                size="medium"
                post=" MET"
              />
            }
            value={this.props.sourceDisplayName}
            label="Source"
          />

          <Selector
            topMargin
            onChange={this.props.onInputChange}
            options={this.props.availableDestinations}
            error={this.props.errors.destination}
            label="Destination"
            value={this.props.destination}
            id="destination"
          />

          <TextInput
            keyboardType="decimal-pad"
            topMargin
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

          {this.props.fee && (
            <Text mt={1}>
              You would pay a fee of approximately{' '}
              <DisplayValue
                value={this.props.fee}
                color="primary"
                post=" MET"
              />
            </Text>
          )}

          {this.props.feeError && (
            <Text color="danger" mt={1}>
              Error getting fee estimate: {this.props.feeError}
            </Text>
          )}

          <View grow={1} mt={2}>
            <GasEditor
              onInputChange={this.props.onInputChange}
              useCustomGas={this.props.useCustomGas}
              gasLimit={this.props.gasLimit}
              gasPrice={this.props.gasPrice}
              errors={this.props.errors}
            />
          </View>
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withPortFormState(PortDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Port Metronome',
  headerBackTitle: null,
  headerRight: (
    <BaseBtn
      textProps={{ weight: 'semibold', size: 'medium' }}
      onPress={navigation.getParam('onHeaderRightPress', null)}
      label="Review"
      mr={1}
    />
  )
})

export default EnhancedComponent
