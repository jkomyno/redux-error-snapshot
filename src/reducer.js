// @flow
import { RESET_ERROR_STATE } from './reduxTypes';
import type {
  snapshotError,
  lastActionType,
} from './types';

export default (state: snapshotError | null = null, lastAction: lastActionType) => {
  const {
    type,
    error,
    action,
    args,
  } = lastAction;

  if (type === RESET_ERROR_STATE) {
    return null;
  } else if (error) {
    return {
      error,
      action,
      args,
    };
  }

  return state;
};
