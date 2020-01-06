# Metronome Mobile Wallet

This is a Metronome-specific mobile wallet build on React Native.

## Development

### Prerequisites

**Xcode v10.1** and **Android Studio v3.4.2** are required. Newer versions are not guaranteed to generate a successful build.

#### Multiple Xcode versions

You might want to have multiple Xcode versions installed in your local environment. In order to do so, follow these steps:

1. Download the required version from [Apple Developers website](https://developer.apple.com/download/more/?name=Xcode)
2. Unzip and rename the `.app` file to include the version name (e.g. `Xcode.app` -> `Xcode-10.1.app`)
3. Move the file to your `/Applications` directory
4. Change the active developer directory for the Xcode command line tools by running `sudo xcode-select -s /Applications/Xcode-10.1.app/Contents/Developer`

#### Change the Android Studio version

To install a specific Android Studio version, download it from the [Android Developers website](https://developer.android.com/studio/archive.html).

### Installation

#### iOS

In order to run a development version of the app in the iOS simulator, run:

```sh
npm install
npm run ios
```

⚠ React Native v0.59 has a couple of bugs that require additional steps before the first run:

- **Xcode build fails to download third-party dependencies**

  To overcome this, run:

  ```sh
  npm run ios:fix-third-party
  ```

  See [related issue](https://github.com/facebook/react-native/issues/20774).

- **iOS main.jsbundle is not created automatically**

  To overcome this, run:

  ```sh
  npm run ios:bundle
  ```

  See [related issue](https://github.com/facebook/react-native/issues/18472).

#### Android

Android simulator is also available. After a successfull `npm install` run:

```sh
npm run android
```

### Customization

To customize the build, create a `.env`. The following variables are supported:

- `ENABLED_CHAINS`: A comma separated string of configuration filenames. See `src/config`.
- `MORDOR_INDEXER_URL`, `MORDOR_NODE_URL`: Mordor testnet URLs.
- `ROPSTEN_INDEXER_URL`, `ROPSTEN_NODE_URL`: Ropsten testnet URLs.
- `QTUMTEST_EXPLORER_URL`, `QTUMTEST_NODE_URL`: Qtum testnet URLs.

### Sentry setup

```sh
cp sentry.properties.example ios/sentry.properties
cp sentry.properties.example android/sentry.properties
```

Then add your keys into both files.

## License

MIT
