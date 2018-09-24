import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge'
import config from '../config'

const tracker = new GoogleAnalyticsTracker(config.TRACKING_ID);

export const withAnalytics = ({ eventCategory, eventAction }) => function (fn) {
  return function (...args){
    tracker.trackEvent(eventCategory, `${eventAction} initiated`)
    return fn(...args)
      .then(() => tracker.trackEvent(eventCategory, `${eventAction} succeeded`))
      .catch(() => tracker.trackEvent(eventCategory, `${eventAction} failed`))
  }
}
