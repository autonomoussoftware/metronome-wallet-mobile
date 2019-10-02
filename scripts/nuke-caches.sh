#!/bin/bash

watchman watch-del-all
rm -rf ~/.rncache
rm -rf $TMPDIR/metro-* || true
rm -rf $TMPDIR/react-native-* || true
rm -rf $TMPDIR/haste-* || true

# iOS SPECIFIC
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build
rm ios/main.jsbundle

# ANDROID SPECIFIC
rm android/main.jsbundle
cd android
./gradlew clean
./gradlew :app:dependencies
cd ..
