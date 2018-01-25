import RecoverFromMnemonic from './RecoverFromMnemonic';
import { DrawerNavigator } from 'react-navigation';
import EthereumWallet from './modules/EthereumWallet';
import AuctionBoard from './modules/AuctionBoard';
import Debug from './Debug';

export default DrawerNavigator(
  {
    EthereumWallet: {
      screen: EthereumWallet
    },
    AuctionBoard: {
      screen: AuctionBoard
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
