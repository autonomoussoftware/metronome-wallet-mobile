import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmRecover from './ConfirmRecover'
import Tools from './Tools'

export default createStackNavigator(
  {
    ConfirmRecover,
    Tools
  },
  {
    initialRouteName: 'Tools',
    navigationOptions: commonStackStyles
  }
)
