# Metronome Mobile Wallet

This is a Metronome-specific mobile wallet build on React Native.

## Setup

After cloning the project, run

```sh
npm ci
```

## Development

The following tools are required

- Node v12 at minimum (v14 is recommended)

*For Android*
- Android studio v4.2.1

*For iOS*
- xCode v12.5
- cocoapods 1.10.0

#### iOS

```shell
# Bundle the application
npm run ios:bundle
# Start metro in terminal 1
npm run start 
# run the emulator in terminal 2
npm run ios
```

#### Android

```shell
# Start metro in terminal 1
npm start
# run the emulator in terminal 2
npm run android
```

If the simulator is not started automatically, try with the following commands before:

```shell
emulator -list-avds
# if no devices are listed, see https://developer.android.com/studio/run/managing-avds

# pick a device from that list and then run the following
emulator @<device-name>
```

And the run the commands mentioned above

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

### Troubleshooting

#### iOS

- If you're using `nvm` and you get the error 
> Command PhaseScriptExecution failed with a nonzero exit code

Make sure you've run the commands for Sentry setup above :point_up: - you will also need to complete those `sentry.properties` with a real sentry config. 

If the issue persist, check this issue https://github.com/facebook/react-native/issues/31181 - you might need to set an alias for `default`

```sh
# replace "lts/erbium" with the appropiate lts version listed in nvm list
nvm alias "default" "lts/fermium"
```
If you get the error

> env: node: No such file or directory

You might need to link your nvm with your `usrl` local. 

Try
```sh
sudo ln -s "$(which node)" /usr/local/bin/node 
````

As stated in [this answer](https://stackoverflow.com/a/66874780/1437934)


- If you get the error `error: SDK "iphoneos" cannot be located` when running `npm ci`, run the following commmand:

```sh
sudo xcode-select --switch /Applications/Xcode.app
```

and run `npm ci` again

## License

MIT
