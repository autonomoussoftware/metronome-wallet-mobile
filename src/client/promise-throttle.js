// TODO move to lib/promise-throttle

export default function promiseThrottle (fn) {
  let promise = Promise.resolve()
  return function (...args) {
    return promise
      .catch()
      .then(fn(...args))
  }
}
