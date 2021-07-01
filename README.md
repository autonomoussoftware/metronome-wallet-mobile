# Metronome Mobile Wallet

This is a Metronome-specific mobile wallet build on React Native.

## Development

In order to run a development version of the app in the iOS simulator, run:

**XCode v10.1 and Android Studio v3.4.2 are required**

```shell
npm install
npm run ios
```

make xcode works https://stackoverflow.com/a/66216765/1437934
TODO  run script for first time compilation
https://github.com/facebook/react-native/issues/20774#issuecomment-475521787
npx react-native link https://reactnative.dev/docs/linking-libraries-ios
TODO reinstall geolocation module https://github.com/react-native-geolocation/react-native-geolocation#migrating-from-the-core-react-native-module

Android simulator is also available:

```shell
npm run android
```

### Customization

To customize the build, create a `.env`. The following variables are supported:

- `ENABLED_CHAINS`: A comma separated string of configuration filenames. See `src/config`.
- `MORDOR_INDEXER_URL`, `MORDOR_NODE_URL`: Mordor testnet URLs.
- `ROPSTEN_INDEXER_URL`, `ROPSTEN_NODE_URL`: Ropsten testnet URLs.

### Sentry setup

```shell
cp sentry.properties.example ios/sentry.properties
cp sentry.properties.example android/sentry.properties
```

Then add your keys into both files.

## License

MIT
