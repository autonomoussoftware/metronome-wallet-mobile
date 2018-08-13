import { createStackNavigator } from 'react-navigation'
import BuyMETForm from './BuyMETForm'
import Auction from './Auction'
import MenuBtn from '../common/MenuBtn'
import theme from '../../theme'
import React from 'react'

export default createStackNavigator(
  {
    Auction: {
      screen: Auction,
      navigationOptions: ({ navigation }) => ({
        title: 'Auction',
        headerBackTitle: null,
        headerLeft: <MenuBtn onPress={navigation.openDrawer} />
      })
    },
    BuyDrawer: {
      screen: BuyMETForm,
      navigationOptions: {
        title: 'Buy Metronome'
      }
    }
  },
  {
    initialRouteName: 'Auction',
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
