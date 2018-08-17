import { handleActions } from 'redux-actions'
import _ from 'lodash'

const initialState = {
  active: null,
  allIds: null,
  byId: null
}

const reducer = handleActions(
  {
    'create-wallet': (state, { payload }) => ({
      ...state,
      allIds: [...(state.allIds || []), payload.walletId],
      active: payload.walletId
    }),

    'open-wallets': (state, { payload }) => ({
      ...state,
      allIds: payload.walletIds,
      active: payload.activeWallet || payload.walletIds[0] || null
    }),

    'wallet-state-changed': (state, { payload }) => ({
      ...state,
      byId: _.mergeWith(
        {},
        state.byId || {},
        payload,
        (objValue, srcValue, key) => {
          if (key === 'transactions') {
            return _.unionBy(srcValue, objValue, 'transaction.hash')
          }
        }
      )
    }),

    'wallets-set': (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
)

export default reducer
