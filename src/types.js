// @flow
export type { ThunkAction } from 'redux-thunk';

export type snapshotError = {
  error?: string,
  action?: (...args: Array<any>) => void,
  args?: Array<any>,
  meta?: {
    [string]: any,
  },
};

export type lastActionType = {
  type: string,
  ...snapshotError,
};

export type reducerType = (state?: snapshotError, lastAction: lastActionType) => snapshotError;
export type reducerCreatorType = (blacklist?: Array<string>) => reducerType;

export type existsInType = (value: string, array: Array<string>) => bool;
