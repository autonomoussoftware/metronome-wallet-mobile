import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import theme from 'metronome-wallet-ui-logic/src/theme'
import merge from 'lodash/merge'
import RN from 'react-native'

import {fontStyles} from '../../utils'

export default function createCustomNavigator(routes, customConfig) {
  const {width} = RN.Dimensions.get('window')

  const defaultConfig = {
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {left: 0, right: 0},
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.light,
      headerTitleStyle: {
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 1,
        textShadowColor: theme.colors.darkShade,
        fontSize: width < 375 ? theme.sizes.medium : theme.sizes.large,
        color: theme.colors.light,
        ...fontStyles('bold'),
      },
    },
  }

  const customNavigator = createAppContainer(
    createStackNavigator(routes, merge(defaultConfig, customConfig)),
  )

  customNavigator.navigationOptions = ({navigation}) => ({
    // On swipe, display drawer if in first card, otherwise navigate back
    drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked',
  })

  return customNavigator
}
