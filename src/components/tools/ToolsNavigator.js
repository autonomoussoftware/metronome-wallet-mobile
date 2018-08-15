import { createStackNavigator } from 'react-navigation'
import MenuBtn from '../common/MenuBtn'
import theme from '../../theme'
import Tools from './Tools'
import React from 'react'

export default createStackNavigator(
  {
    Tools: {
      screen: Tools,
      navigationOptions: ({ navigation }) => ({
        title: 'Tools',
        headerBackTitle: null,
        headerLeft: <MenuBtn onPress={navigation.openDrawer} />
      })
    }
  },
  {
    initialRouteName: 'Tools',
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
