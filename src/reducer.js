// @flow
import { RESET_ERROR_STATE } from './reduxTypes';
import type {
  snapshotError,
  lastActionType,
} from './types';

export const initialState = {
  meta: {},
};

export default (state: snapshotError = initialState, lastAction: lastActionType) => {
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
