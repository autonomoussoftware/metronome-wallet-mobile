import { wrapConnectedComponent } from '../../utils'
import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmCoinToMET from './ConfirmCoinToMET'
import ConfirmMETtoCoin from './ConfirmMETtoCoin'
import ConvertDrawer from './ConvertDrawer'
import Converter from './Converter'

const ConverterNavigator = createCustomNavigator(
  {
    ConfirmCoinToMET,
    ConfirmMETtoCoin,
    ConvertDrawer: wrapConnectedComponent(ConvertDrawer),
    Converter
  },
  {
    initialRouteName: 'Converter'
  }
)

export default ConverterNavigator
