// @flow
import { RESET_ERROR_STATE } from './reduxTypes';
import { existsIn } from './utils';
import type {
  reducerType,
  reducerCreatorType,
} from './types';

export const initialState = {
  meta: {},
};

const reducer: reducerType = (state = initialState, lastAction) => {
  const {
    type,
    error,
    action,
    args,
    meta,
  } = lastAction;

  if (type === RESET_ERROR_STATE) {
    return initialState;
  } else if (error) {
    return {
      error,
      action,
      args,
      meta: {
        ...state.meta,
        ...meta,
      },
    };
  }

  return state;
};

export default reducer;

export const reducerCreator: reducerCreatorType = (blacklist = []) =>
  (state, action) => {
    // $FlowFixMe
    if (existsIn(action.type, blacklist)) {
      return initialState;
    }

    return reducer(state, action);
  };
