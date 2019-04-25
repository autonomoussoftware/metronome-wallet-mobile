import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge'

import config from '../config'

export const tracker = new GoogleAnalyticsTracker(config.trackingId)

export const withAnalytics = ({ eventCategory, eventAction }) => fn =>
  function (...args) {
    tracker.trackEvent(eventCategory, `${eventAction} initiated`)
    return Promise.resolve(fn(...args))
      .then(function (res) {
        tracker.trackEvent(eventCategory, `${eventAction} succeeded`)
        return res
      })
      .catch(function (err) {
        tracker.trackEvent(eventCategory, `${eventAction} failed`)
        return Promise.reject(err)
      })
  }
