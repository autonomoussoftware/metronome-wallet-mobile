import { handleActions } from 'redux-actions'

const initialState = {}

const reducer = handleActions(
  {
    'eth-price-updated': (state, { payload }) => ({
      ...state,
      [payload.token]: payload
    }),

    'rates-set': (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
)

export default reducer
