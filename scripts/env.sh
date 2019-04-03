#!/bin/bash
if [ $TRAVIS_BRANCH = master ];
  then ENABLED_CHAINS=$PROD_CHAINS;
  else ENABLED_CHAINS=$TEST_CHAINS;
fi

echo "ENABLED_CHAINS are: " $ENABLED_CHAINS

cat > .env << EOF
RN_DEBUG=$RN_DEBUG
ENABLED_CHAINS=$ENABLED_CHAINS
SENTRY_DSN=$SENTRY_DSN
TRACKING_ID=$TRACKING_ID
METRONOME_RELEASE_STORE_FILE=$METRONOME_RELEASE_STORE_FILE
METRONOME_RELEASE_STORE_PASSWORD=$METRONOME_RELEASE_STORE_PASSWORD
METRONOME_RELEASE_KEY_ALIAS=$METRONOME_RELEASE_KEY_ALIAS
METRONOME_RELEASE_KEY_PASSWORD=$METRONOME_RELEASE_KEY_PASSWORD
ROPSTEN_INDEXER_URL=$ROPSTEN_INDEXER_URL
ROPSTEN_API_URL=$ROPSTEN_API_URL
ROPSTEN_NODE_URL=$ROPSTEN_NODE_URL
MORDEN_INDEXER_URL=$MORDEN_INDEXER_URL
MORDEN_API_URL=$MORDEN_API_URL
MORDEN_NODE_URL=$MORDEN_NODE_URL
EOF
