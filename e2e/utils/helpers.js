export const waitExistence = testID => expect(element(by.id(testID))).toExist()

export const waitText = str => expect(element(by.text(str))).toExist()

export const tap = testID => element(by.id(testID)).tap()

export const fillField = (testID, value) =>
  element(by.id(testID)).typeText(value)

// Trick to get text from screen cause Detox doesn't have support for that yet
// @see https://github.com/wix/detox/issues/445#issuecomment-466421130
export async function readTextValue(testID) {
  try {
    await expect(element(by.id(testID))).toHaveText('__read_element_error_')
  } catch (error) {
    const start = `AX.id='${testID}';`
    const end = '; AX.frame'
    const errorMessage = error.message.toString()
    const [, restMessage] = errorMessage.split(start)
    const [label] = restMessage.split(end)
    const [, value] = label.split('=')

    return value.slice(1, value.length - 1)
  }
}
