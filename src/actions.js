// @flow
import { RESET_ERROR_STATE } from './reduxTypes';
import { defaultReducerName } from './config';
import type {
  ThunkAction,
  lastActionType,
} from './types';

export const resetErrorState = () => ({
  type: RESET_ERROR_STATE,
});

export const retryLastAction = (reducerName: string | null = null):
  ThunkAction<void, {reducerName: lastActionType}> =>
  (dispatch, getState) => {
    // necessary since in react native after dispatch you automatically have a
    // Proxy Event as first argument
    if (typeof reducerName !== 'string') {
      // eslint-disable-next-line no-param-reassign
      reducerName = defaultReducerName;
    }
    const {
      action,
      args,
    } = getState()[reducerName];
    dispatch(resetErrorState());
    dispatch(action(...args));
  };
