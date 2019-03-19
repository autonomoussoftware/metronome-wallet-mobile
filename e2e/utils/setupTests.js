const adapter = require('detox/runners/jest/adapter')
const config = require('../../package.json').detox
const detox = require('detox')

jest.setTimeout(120000)
jasmine.getEnv().addReporter(adapter)

beforeAll(async () => {
  await detox.init(config)
})

beforeEach(async () => {
  await adapter.beforeEach()
})

afterAll(async () => {
  await adapter.afterAll()
  await detox.cleanup()
})
