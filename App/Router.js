import RecoverFromMnemonic from './RecoverFromMnemonic';
import { DrawerNavigator } from 'react-navigation';
import MetronomeDashboard from './modules/MetronomeWallet/Dashboard';
import AuctionBoard from './modules/MetronomeWallet/AuctionBoard';
import Debug from './Debug';

export default DrawerNavigator(
  {
    MetronomeWallet: {
      screen: MetronomeDashboard
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
  { initialRouteName: 'MetronomeWallet' }
);
