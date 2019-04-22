#!/bin/bash

react-native bundle \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios \
  --platform ios $@
