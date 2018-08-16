import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmETHtoMET from './ConfirmETHtoMET'
import ConfirmMETtoETH from './ConfirmMETtoETH'
import ConvertDrawer from './ConvertDrawer'
import Converter from './Converter'

export default createStackNavigator(
  {
    ConfirmETHtoMET,
    ConfirmMETtoETH,
    ConvertDrawer,
    Converter
  },
  {
    navigationOptions: commonStackStyles,
    initialRouteName: 'Converter'
  }
)
