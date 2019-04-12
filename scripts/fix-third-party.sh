#!/bin/bash

# Workaround for issue during compile on first build
# see https://github.com/facebook/react-native/issues/20774

cd node_modules/react-native
./scripts/ios-install-third-party.sh
cd third-party/glog-0.3.4
../../scripts/ios-configure-glog.sh
cd ../../../..
