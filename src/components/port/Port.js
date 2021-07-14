import {toChecksumAddress} from 'web3-utils'
import withPortState from 'metronome-wallet-ui-logic/src/hocs/withPortState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import {MenuBtn, View, Text, Btn} from '../common'
import PortIcon from '../icons/PortIcon'
import ItemRow from './ItemRow'

class Port extends React.Component {
  static propTypes = {
    attestationThreshold: PropTypes.number.isRequired,
    portDisabledReason: PropTypes.string,
    ongoingImports: PropTypes.arrayOf(
      PropTypes.shape({
        currentBurnHash: PropTypes.string.isRequired,
        attestedCount: PropTypes.number.isRequired,
        refutedCount: PropTypes.number.isRequired,
        importedFrom: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        hash: PropTypes.string.isRequired
      })
    ).isRequired,
    failedImports: PropTypes.arrayOf(
      PropTypes.shape({
        currentBurnHash: PropTypes.string.isRequired,
        originChain: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired
      })
    ).isRequired,
    retryDisabled: PropTypes.bool.isRequired,
    portDisabled: PropTypes.bool.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  handleNewPortPress = () => this.props.navigation.navigate('PortDrawer')

  handleRetryClick = hash => {
    const retryCandidate = this.props.failedImports
      .concat(this.props.ongoingImports)
      .find(({currentBurnHash}) => currentBurnHash === hash)
    if (retryCandidate) {
      this.props.navigation.navigate('RetryImportDrawer', {
        ...retryCandidate,
        from: toChecksumAddress(retryCandidate.from)
      })
    } else {
      RN.Alert.alert('Error', `Can't find transaction ${hash}`)
    }
  }

  render() {
    return (
      <View bg="dark" flex={1} scroll contentContainerStyle={styles.container}>
        {(this.props.failedImports.length > 0 ||
          this.props.ongoingImports.length > 0) && (
          <View align="center" flex={1} grow={1}>
            {this.props.failedImports.length > 0 && (
              <View mb={4}>
                <Text size="large" weight="bold">
                  Failed Ports
                </Text>
                <Text my={1}>
                  Resubmit incomplete ports that failed to execute by clicking
                  Retry.
                </Text>
                <View>
                  {this.props.failedImports.map(item => (
                    <ItemRow
                      retryDisabled={this.props.retryDisabled}
                      onRetryClick={() =>
                        this.handleRetryClick(item.currentBurnHash)
                      }
                      details={
                        <Text>
                          EXPORTED FROM{' '}
                          <Text weight="bold">{item.originChain}</Text>
                        </Text>
                      }
                      badge={<Text ls={1}>FAILED</Text>}
                      value={item.value}
                      key={item.currentBurnHash}
                    />
                  ))}
                </View>
              </View>
            )}

            {this.props.ongoingImports.length > 0 && (
              <View>
                <Text size="large" weight="bold">
                  Ongoing Ports
                </Text>
                <Text my={1}>
                  An Import Request requires at least{' '}
                  <Text color="primary" weight="bold">
                    {this.props.attestationThreshold}{' '}
                    {this.props.attestationThreshold > 1
                      ? 'validations'
                      : 'validation'}
                  </Text>{' '}
                  for the MET to be imported on this chain.
                </Text>

                <View>
                  {this.props.ongoingImports.map(item => (
                    <ItemRow
                      retryDisabled={this.props.retryDisabled}
                      onRetryClick={() =>
                        this.handleRetryClick(item.currentBurnHash)
                      }
                      details={
                        <Text>
                          IMPORTING FROM{' '}
                          <Text weight="bold">{item.importedFrom}</Text>
                        </Text>
                      }
                      badge={
                        <Text>
                          {item.attestedCount} /{' '}
                          {this.props.attestationThreshold}
                        </Text>
                      }
                      value={item.value}
                      key={item.hash}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {this.props.failedImports.length === 0 &&
          this.props.ongoingImports.length === 0 && (
            <View align="center" justify="center" flex={1} grow={1}>
              <PortIcon size="64" />
              <Text size="large" mt={2} weight="semibold">
                You have no pending ports
              </Text>
              <Text opacity={0.8} align="center" size="medium" mw={300} mt={1}>
                Port your Metronome between any of the other supported chains
              </Text>
            </View>
          )}

        <View mt={4}>
          {this.props.portDisabledReason && (
            <Text opacity={0.8} align="center" size="small" mb={2}>
              {this.props.portDisabledReason}
            </Text>
          )}
          <Btn
            disabled={this.props.portDisabled}
            onPress={this.handleNewPortPress}
            label="New Port"
            block
          />
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    minHeight: '100%'
  }
})

const EnhancedComponent = withPortState(Port)

EnhancedComponent.navigationOptions = ({navigation}) => ({
  headerTitle: 'Port',
  headerBackTitle: null,
  headerLeft: () => <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
