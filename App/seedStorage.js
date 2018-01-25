import RNSecureKeyStore from 'react-native-secure-key-store';
import settings from './config/settings';

export function storeSeed(value) {
  return RNSecureKeyStore.set(settings.SECURE_STORAGE_KEY, value);
}

export function retrieveSeed() {
  return RNSecureKeyStore.get(settings.SECURE_STORAGE_KEY);
}

export function removeSeed() {
  return RNSecureKeyStore.remove(settings.SECURE_STORAGE_KEY);
}
