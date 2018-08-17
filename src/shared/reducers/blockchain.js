import { handleActions } from 'redux-actions'

const initialState = {
  height: null
}

const reducer = handleActions(
  {
    'eth-block': (state, { payload }) => ({
      ...state,
      height: payload.number
    }),

    'blockchain-set': (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
)

export default reducer
