// @flow
export type { ThunkAction } from 'redux-thunk';

export type snapshotError = {
  error: string,
  action: (...args: Array<any>) => void,
  args: Array<any>,
};

export type lastActionType = {
  type: string,
  ...snapshotError,
};
