import singleCoreHandlers from './single-core'
import multiCoreHandlers from './multi-core'
import noCoreHandlers from './no-core'
import { findCoreByChainName } from './utils'

const withCores = cores => fn => data => fn(data, cores)

const withChain = cores => fn => data => {
  const core = findCoreByChainName(cores, data.chain)
  return fn(data, core)
}

export const getHandlers = cores => {
  const handlers = {}
  Object.keys(noCoreHandlers).forEach(functionName => {
    handlers[functionName] = noCoreHandlers[functionName]
  })
  Object.keys(singleCoreHandlers).forEach(functionName => {
    handlers[functionName] = withChain(cores)(singleCoreHandlers[functionName])
  })
  Object.keys(multiCoreHandlers).forEach(functionName => {
    handlers[functionName] = withCores(cores)(multiCoreHandlers[functionName])
  })
  return handlers
}
