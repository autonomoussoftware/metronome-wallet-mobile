  #!/bin/bash
  
  watchman watch-del-all
  rm -rf ~/.rncache
  rm -rf ~/Library/Developer/Xcode/DerivedData
  rm -rf $TMPDIR/metro-* || true
  rm -rf $TMPDIR/react-native-* || true
  rm -rf $TMPDIR/haste-* || true
  rm -rf ios/build
  rm ios/main.jsbundle
