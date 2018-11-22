// TODO move to lib/promise-throttle

export default function promiseThrottle (fn) {
  const promise = Promise.resolve()
  return function (...args) {
    return promise
      .catch()
      .then(fn(...args))
  }
}
