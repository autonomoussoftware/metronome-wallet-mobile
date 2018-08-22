import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmRecover from './ConfirmRecover'
import ConfirmRescan from './ConfirmRescan'
import Tools from './Tools'

export default createStackNavigator(
  {
    ConfirmRecover,
    ConfirmRescan,
    Tools
  },
  {
    initialRouteName: 'Tools',
    navigationOptions: commonStackStyles
  }
)
