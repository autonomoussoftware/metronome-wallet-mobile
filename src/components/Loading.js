import withLoadingState from 'metronome-wallet-ui-logic/src/hocs/withLoadingState'
import useLoadingState from 'metronome-wallet-ui-logic/src/hooks/useLoadingState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { PatternView, ChecklistItem, View, Text, BaseBtn } from './common'

function Loading(props) {
  const { handleDetailsClick, isDetailVisible, isBtnVisible } = useLoadingState(
    props.chainsStatus
  )

  const handlePress = React.useCallback(() => {
    RN.LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: RN.LayoutAnimation.Types.easeIn,
        property: RN.LayoutAnimation.Properties.opacity
      },
      update: {
        type: RN.LayoutAnimation.Types.easeIn,
        property: RN.LayoutAnimation.Properties.opacity
      }
    })
    handleDetailsClick()
  }, [])

  return (
    <PatternView>
      <View flex={1} justify="center" align="center">
        <RN.ActivityIndicator size="large" />

        <Text size="large" weight="bold" my={4}>
          Gathering Information...
        </Text>

        <View>
          {Object.keys(props.chainsStatus).map(
            // eslint-disable-next-line complexity
            chainName => {
              const {
                hasBlockHeight,
                hasCoinBalance,
                hasMetBalance,
                hasCoinRate,
                displayName,
                symbol
              } = props.chainsStatus[chainName]

              const isActive =
                hasBlockHeight && hasCoinBalance && hasMetBalance && hasCoinRate

              return (
                <ChecklistItem
                  isActive={isActive}
                  text={`${displayName} network`}
                  key={chainName}
                >
                  {isDetailVisible && !isActive && (
                    <View ml={4.5} opacity={0.5}>
                      <Text isActive={hasBlockHeight}>
                        Blockchain status{' '}
                        {hasBlockHeight && (
                          <Text color="success" weight="semibold" size="small">
                            OK
                          </Text>
                        )}
                      </Text>
                      <Text isActive={hasCoinRate}>
                        {symbol} exchange data{' '}
                        {hasCoinRate && (
                          <Text color="success" weight="semibold" size="small">
                            OK
                          </Text>
                        )}
                      </Text>
                      <Text isActive={hasCoinBalance}>
                        {symbol} balance{' '}
                        {hasCoinBalance && (
                          <Text color="success" weight="semibold" size="small">
                            OK
                          </Text>
                        )}
                      </Text>
                      <Text isActive={hasMetBalance}>
                        MET balance{' '}
                        {hasMetBalance && (
                          <Text color="success" weight="semibold" size="small">
                            OK
                          </Text>
                        )}
                      </Text>
                    </View>
                  )}
                </ChecklistItem>
              )
            }
          )}
        </View>
        {isBtnVisible && (
          <BaseBtn
            textProps={{ opacity: 0.5, weight: 'semibold', ls: 1 }}
            onPress={handlePress}
            label="SHOW DETAILS"
            size="xSmall"
            mt={2}
            mb={-3.8}
          />
        )}
      </View>
    </PatternView>
  )
}

Loading.propTypes = {
  chainsStatus: PropTypes.objectOf(
    PropTypes.shape({
      hasBlockHeight: PropTypes.bool,
      hasCoinBalance: PropTypes.bool,
      hasMetBalance: PropTypes.bool,
      hasCoinRate: PropTypes.bool,
      displayName: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    })
  ).isRequired
}

export default withLoadingState(Loading)
