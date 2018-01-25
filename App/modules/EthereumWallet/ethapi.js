import settings from '../../config/settings';
import Web3 from 'web3';

const api = new Web3(
  new Web3.providers.WebsocketProvider(settings.MTN_PUBLIC_NODE_URL)
);

export default api;
