import { createStackNavigator } from 'react-navigation'
import { fontStyles } from '../../utils'
import { merge } from 'lodash'
import theme from '../../theme'
import RN from 'react-native'

export default function createCustomNavigator(routes, customConfig) {
  const { width } = RN.Dimensions.get('window')

  const defaultConfig = {
    headerLayoutPreset: 'center',
    navigationOptions: {
      headerTitleContainerStyle: { left: 0, right: 0 },
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: theme.colors.primary
      },
      headerTintColor: theme.colors.light,
      headerTitleStyle: {
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        textShadowColor: theme.colors.darkShade,
        fontSize: width < 375 ? theme.sizes.medium : theme.sizes.large,
        color: theme.colors.light,
        ...fontStyles('bold')
      }
    }
  }

  const customNavigator = createStackNavigator(
    routes,
    merge(defaultConfig, customConfig)
  )

  customNavigator.navigationOptions = ({ navigation }) => ({
    // On swipe, display drawer if in first card, otherwise navigate back
    drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked'
  })

  return customNavigator
}
