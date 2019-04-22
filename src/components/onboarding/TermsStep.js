import TermsAndConditions from 'metronome-wallet-ui-logic/src/components/TermsAndConditions'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { Checkbox, View, Text, Btn } from '../common'

const TermsText = p => <Text my={1} size="small" align="justify" {...p} />

export default class TermsStep extends React.Component {
  static propTypes = {
    onTermsLinkClick: PropTypes.func.isRequired,
    onTermsAccepted: PropTypes.func.isRequired,
    licenseCheckbox: PropTypes.bool.isRequired,
    termsCheckbox: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired
  }

  render() {
    return (
      <View justify="center" align="center" flex={1} p={2}>
        <Text size="large" weight="semibold" mt={4}>
          Accept to Continue
        </Text>
        <Text size="medium" mt={3} align="center">
          Please read and accept these terms and permissions.
        </Text>

        <View flex={1} grow={1} mt={3} px={1} bg="darkShade">
          <RN.ScrollView>
            <TermsAndConditions ParagraphComponent={TermsText} />
          </RN.ScrollView>
        </View>
        <Checkbox
          onChange={this.props.onInputChange}
          checked={this.props.termsCheckbox}
          label="I have read and accept these terms"
          id="termsCheckbox"
          mt={4}
        />
        <Checkbox
          onChange={this.props.onInputChange}
          checked={this.props.licenseCheckbox}
          label={
            <React.Fragment>
              I have read and accept the{' '}
              <Text
                onPress={this.props.onTermsLinkClick}
                color="success"
                mb={-0.4}
              >
                software license
              </Text>
            </React.Fragment>
          }
          id="licenseCheckbox"
          mt={1}
        />
        <Btn
          disabled={!this.props.licenseCheckbox || !this.props.termsCheckbox}
          onPress={this.props.onTermsAccepted}
          label="Continue"
          block
          mt={2}
        />
      </View>
    )
  }
}
