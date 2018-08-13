import { createStackNavigator } from 'react-navigation'
import ReceiveDrawer from './ReceiveDrawer'
import ReceiptDrawer from './ReceiptDrawer'
import SendDrawer from './SendDrawer'
import Dashboard from './Dashboard'
import MenuBtn from '../common/MenuBtn'
import theme from '../../theme'
import React from 'react'

export default createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: ({ navigation }) => ({
        title: 'My Wallet',
        headerBackTitle: null,
        headerLeft: <MenuBtn onPress={navigation.openDrawer} />
      })
    },
    SendDrawer: {
      screen: SendDrawer,
      navigationOptions: {
        title: 'Send'
      }
    },
    ReceiveDrawer: {
      screen: ReceiveDrawer,
      navigationOptions: {
        title: 'Receive'
      }
    },
    ReceiptDrawer: {
      screen: ReceiptDrawer,
      navigationOptions: {
        title: 'Transaction Receipt'
      }
    }
  },
  {
    initialRouteName: 'Dashboard',
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
