import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmRetryImport from './ConfirmRetryImport'
import RetryImportDrawer from './RetryImportDrawer'
import ConfirmPort from './ConfirmPort'
import PortDrawer from './PortDrawer'
import Port from './Port'

const PortNavigator = createCustomNavigator(
  {
    ConfirmRetryImport,
    RetryImportDrawer,
    ConfirmPort,
    PortDrawer,
    Port
  },
  {
    initialRouteName: 'Port'
  }
)

export default PortNavigator
