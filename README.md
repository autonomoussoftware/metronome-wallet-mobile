# Metronome Mobile Wallet

This is a Metronome-specific mobile wallet build on React Native.

## Development

In order to run a development version of the app in the iOS simulator, run:

```
$ npm install
$ npm run ios
```

### Sentry

```
$ cp sentry.properties.example ios/sentry.properties
$ cp sentry.properties.example android/sentry.properties
```

Then add your keys into both files.

## Dev setup considerations

In order to use Node.JS packages as `crypto` in a React Native app, those packages have to be explicitly added through [node-libs-browser](https://github.com/webpack/node-libs-browser). In addition, global variables as `Buffer` and `process` have to be manually set.

Unfortunately [eth-lib](https://github.com/MaiaVictor/eth-lib) uses a dynamic `require()` syntax that breaks the React Native bundler. The easiest solution is to automatically patch the libraries after `npm install` using [patch-package](https://github.com/ds300/patch-package).
