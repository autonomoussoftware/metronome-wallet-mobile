import withRetryImportFormState from 'metronome-wallet-ui-logic/src/hocs/withRetryImportFormState'
import PropTypes from 'prop-types'
import TimeAgo from 'metronome-wallet-ui-logic/src/components/TimeAgo'
import React from 'react'
import RN from 'react-native'

import { DisplayValue, GasEditor, BaseBtn, View, Text } from '../common'
import ReadOnlyField from './ReadOnlyField'

class RetryImportDrawer extends React.Component {
  static propTypes = {
    originDisplayName: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired,
    timestamp: PropTypes.number.isRequired,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    errors: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    fee: PropTypes.string.isRequired
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
      navigation.navigate('ConfirmRetryImport', other)
    }
  }

  render() {
    return (
      <View withKeyboard bg="dark">
        <View flex={1} px={2} py={4} grow={1}>
          <Text mb={2}>
            This Port operation was initiated{' '}
            <Text weight="bold">
              <TimeAgo timestamp={this.props.timestamp} />
            </Text>
            .
          </Text>
          <ReadOnlyField
            value={this.props.originDisplayName}
            label="Origin Blockchain"
          />

          <View mt={1} row>
            <View grow={1}>
              <ReadOnlyField
                value={<DisplayValue value={this.props.value} />}
                label="Amount (MET)"
              />
            </View>
            <View px={1} />
            <View grow={1}>
              <ReadOnlyField
                value={<DisplayValue value={this.props.fee} />}
                label="Fee (MET)"
              />
            </View>
          </View>

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

const EnhancedComponent = withRetryImportFormState(RetryImportDrawer)

// This wrapper component is needed to grab the retry import data from the
// navigation state and pass it down to the withRetryImportFormState HOC
export default class RetryImport extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
      state: PropTypes.object.isRequired
    }).isRequired
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Retry Import',
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

  state = { importData: null }

  // As no other fields are user-editable in a Retry Import form we need to set
  // the importData this way to trigger a gas estimate fetch
  componentDidMount() {
    this.setState({ importData: this.props.navigation.state.params })
  }

  render() {
    return (
      <EnhancedComponent
        navigation={this.props.navigation}
        importData={this.state.importData}
      />
    )
  }
}
