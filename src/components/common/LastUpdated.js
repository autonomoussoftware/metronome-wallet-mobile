import PropTypes from 'prop-types'
import TimeAgo from 'metronome-wallet-ui-logic/src/components/TimeAgo'
import React from 'react'

import Text from './Text'

export const Label = ({ level, children }) => (
  <Text color={{ warning: 'warning', danger: 'danger', ok: 'weak' }[level]}>
    {children}
  </Text>
)

Label.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf(['ok', 'warning', 'danger']).isRequired
}

function defaultRender({ level, timeAgo }) {
  return <Label level={level}>Last updated {timeAgo}</Label>
}

defaultRender.propTypes = {
  timeAgo: PropTypes.string,
  level: PropTypes.oneOf(['ok', 'warning', 'danger']).isRequired
}

export default function LastUpdated({ timestamp, render }) {
  return (
    <TimeAgo
      updateInterval={1000}
      timestamp={timestamp}
      render={typeof render === 'function' ? render : defaultRender}
    />
  )
}

LastUpdated.propTypes = {
  timestamp: PropTypes.number,
  render: PropTypes.func
}
