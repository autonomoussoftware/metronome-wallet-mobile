import { isWeiable, isHexable, sanitize } from './utils';
import stringEntropy from 'fast-password-entropy';

function validateAmount(client, amount, propName, max, errors = {}) {
  if (!amount) {
    errors[propName] = 'Amount is required';
  } else if (!isWeiable(client, amount)) {
    errors[propName] = 'Invalid amount';
  } else if (max && parseFloat(amount) > parseFloat(max)) {
    errors[propName] = 'Insufficient funds';
  } else if (parseFloat(amount) < 0) {
    errors[propName] = 'Amount must be greater than 0';
  }
  return errors;
}

export function validateEthAmount(client, ethAmount, max, errors = {}) {
  return validateAmount(client, ethAmount, 'ethAmount', max, errors);
}

export function validateMetAmount(client, mtnAmount, max, errors = {}) {
  return validateAmount(client, mtnAmount, 'metAmount', max, errors);
}

export function validateToAddress(client, toAddress, errors = {}) {
  if (!toAddress) {
    errors.toAddress = 'Address is required';
  } else if (!client.isAddress(toAddress)) {
    errors.toAddress = 'Invalid address';
  }
  return errors;
}

export function validateGasLimit(client, gasLimit, min, errors = {}) {
  const value = parseFloat(sanitize(gasLimit), 10);

  if (gasLimit === null || gasLimit === '') {
    errors.gasLimit = 'Gas limit is required';
  } else if (Number.isNaN(value)) {
    errors.gasLimit = 'Invalid value';
  } else if (Math.floor(value) !== value) {
    errors.gasLimit = 'Gas limit must be an integer';
  } else if (value <= 0) {
    errors.gasLimit = 'Gas limit must be greater than 0';
  } else if (!isHexable(client, value)) {
    errors.gasLimit = 'Invalid value';
  }
  return errors;
}

export function validateGasPrice(client, gasPrice, errors = {}) {
  const value = parseFloat(sanitize(gasPrice), 10);

  if (gasPrice === null || gasPrice === '') {
    errors.gasPrice = 'Gas price is required';
  } else if (Number.isNaN(value)) {
    errors.gasPrice = 'Invalid value';
  } else if (value <= 0) {
    errors.gasPrice = 'Gas price must be greater than 0';
  } else if (!isWeiable(client, gasPrice, 'gwei')) {
    errors.gasPrice = 'Invalid value';
  } else if (!isHexable(client, client.toWei(gasPrice, 'gwei'))) {
    errors.gasPrice = 'Invalid value';
  }
  return errors;
}

export function validateMnemonic(
  client,
  mnemonic,
  propName = 'mnemonic',
  errors = {}
) {
  if (!mnemonic) {
    errors[propName] = 'The phrase is required';
  } else if (!client.isValidMnemonic(mnemonic)) {
    errors[propName] = "These words don't look like a valid recovery phrase";
  }
  return errors;
}

export function validatePassword(password, errors = {}) {
  if (!password) {
    errors.password = 'Password is required';
  }
  return errors;
}

export function validatePasswordCreation(client, password, errors = {}) {
  if (!password) {
    errors.password = 'Password is required';
  } else if (
    client.getStringEntropy(password) < client.config.REQUIRED_PASSWORD_ENTROPY
  ) {
    errors.password = 'Password is not strong enough';
  }

  return errors;
}
