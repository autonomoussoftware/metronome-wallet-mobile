# Metronome Mobile Wallet

This is a Metronome-specific mobile wallet build on React Native.

## Development

In order to run a development version of the app in the iOS simulator, run:

**XCode v10.1 and Android Studio v3.4.2 are required**

```shell
npm install
npm run ios
```

Android simulator is also available:

```shell
npm run android
```

### Customization

To customize the build, create a `.env`. The following variables are supported:

- `ENABLED_CHAINS`: A comma separated string of configuration filenames. See `src/config`.
- `MORDEN_INDEXER_URL`, `MORDEN_NODE_URL`: Morden testnet URLs.
- `ROPSTEN_INDEXER_URL`, `ROPSTEN_NODE_URL`: Ropsten testnet URLs.

### Sentry setup

```shell
cp sentry.properties.example ios/sentry.properties
cp sentry.properties.example android/sentry.properties
```

Then add your keys into both files.

## License

MIT
