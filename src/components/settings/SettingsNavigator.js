import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import Settings from './Settings'

export default createStackNavigator(
  {
    Settings
  },
  {
    navigationOptions: commonStackStyles,
    initialRouteName: 'Settings'
  }
)
