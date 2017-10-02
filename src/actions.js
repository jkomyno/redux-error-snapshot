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

export const retryLastAction = (reducerName: string | null = defaultReducerName):
  ThunkAction<void, {reducerName: lastActionType}> =>
  (dispatch, getState) => {
    /*
    if (typeof reducerName !== 'string') {
      reducerName = 'freezeErrorState';
    }
    */
    const {
      action,
      args,
    } = getState()[reducerName];
    dispatch(resetErrorState());
    dispatch(action(...args));
  };
