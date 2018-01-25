import RecoverFromMnemonic from './RecoverFromMnemonic';
import { DrawerNavigator } from 'react-navigation';
import EthereumWallet from './modules/EthereumWallet';
import Debug from './Debug';

export default DrawerNavigator(
  {
    EthereumWallet: {
      screen: EthereumWallet
    },
    RecoverFromMnemonic: {
      screen: RecoverFromMnemonic
    },
    Debug: {
      screen: Debug
    }
  },
  { initialRouteName: 'EthereumWallet' }
);
