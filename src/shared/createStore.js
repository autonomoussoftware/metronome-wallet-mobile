import { createStore } from 'redux';
import reducer from './reducers';

export default function(reduxDevtoolsOptions, initialState) {
  const enhancers =
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(reduxDevtoolsOptions);

  return createStore(reducer, initialState, enhancers);
}
