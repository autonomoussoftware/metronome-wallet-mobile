import { createStackNavigator } from 'react-navigation'
import Settings from './Settings'
import MenuBtn from '../common/MenuBtn'
import theme from '../../theme'
import React from 'react'

export default createStackNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        title: 'Settings',
        headerBackTitle: null,
        headerLeft: <MenuBtn onPress={navigation.openDrawer} />
      })
    }
  },
  {
    initialRouteName: 'Settings',
    navigationOptions: {
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: theme.colors.primary
      },
      headerTintColor: theme.colors.light,
      headerTitleStyle: {
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        textShadowColor: theme.colors.darkShade,
        fontWeight: theme.weights.bold,
        fontFamily: 'Muli',
        fontSize: theme.sizes.large,
        color: theme.colors.light
      }
    }
  }
)
