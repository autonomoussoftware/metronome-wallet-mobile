import { createStackNavigator } from 'react-navigation'
import ConvertDrawer from './ConvertDrawer'
import Converter from './Converter'
import MenuBtn from '../common/MenuBtn'
import theme from '../../theme'
import React from 'react'

export default createStackNavigator(
  {
    Converter: {
      screen: Converter,
      navigationOptions: ({ navigation }) => ({
        title: 'Converter',
        headerBackTitle: null,
        headerLeft: <MenuBtn onPress={navigation.openDrawer} />
      })
    },
    ConvertDrawer: {
      screen: ConvertDrawer,
      navigationOptions: {
        title: 'Convert'
      }
    }
  },
  {
    initialRouteName: 'Converter',
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
