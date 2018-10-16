import { mnemonicWords } from 'metronome-wallet-ui-logic/src/utils'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { TextInput, BaseBtn, View } from '../common'

class Suggestions extends React.Component {
  static propTypes = {
    onSuggestionPress: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }

  shouldComponentUpdate({ input }) {
    return input !== this.props.input
  }

  getSuggestions(input) {
    const currentWord = input.split(' ').pop()
    return currentWord.length > 0
      ? mnemonicWords
          .filter(word => word.startsWith(currentWord))
          .map(key => ({ key }))
      : []
  }

  onPress = word => {
    const inputArr = this.props.input.split(' ')
    const newValue = inputArr
      .slice(0, inputArr.length - 1)
      .concat([word])
      .join(' ')
      .concat(' ')
    this.props.onSuggestionPress({ id: this.props.id, value: newValue })
  }

  render() {
    const suggestions = this.getSuggestions(this.props.input)

    return (
      <View
        style={styles.container}
        bg={suggestions.length > 0 ? 'lightShade' : 'transparent'}
      >
        <RN.FlatList
          data={suggestions}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => (
            <View
              style={{ width: RN.StyleSheet.hairlineWidth }}
              bg="primary"
              my={1.5}
            />
          )}
          horizontal
          renderItem={({ item: { key } }) => (
            <BaseBtn
              textProps={{
                weight: 'semibold',
                color: 'primary',
                ls: 0.5
              }}
              onPress={() => this.onPress(key)}
              style={styles.suggestion}
              label={key}
              size="small"
              key={key}
              px={2.5}
            />
          )}
        />
      </View>
    )
  }
}

export default class MnemonicInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    id: PropTypes.string.isRequired
  }

  render() {
    const { onChange, value, id, ...other } = this.props

    return (
      <TextInput
        numberOfLines={3}
        postInput={
          <Suggestions
            onSuggestionPress={onChange}
            input={value || ''}
            id={id}
          />
        }
        multiline
        onChange={onChange}
        value={value}
        id={id}
        {...other}
      />
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    height: 40
  },
  suggestion: {
    justifyContent: 'center'
  }
})
