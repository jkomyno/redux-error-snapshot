// @flow
import type { ThunkAction } from 'redux-thunk';

export type snapshotErrorType = {
  +error?: string,
  +action?: (...args: Array<any>) => ThunkAction,
  +args?: Array<any>,
  +meta?: {
    [string]: any,
  },
};

export type lastActionType =
  & { type: string }
  & snapshotErrorType;

export type reducerType = (state?: snapshotErrorType, lastAction: lastActionType) =>
  snapshotErrorType;

export type reducerCreatorType = (blacklist?: Array<string>) => reducerType;

export type existsInType = (value: string, array: Array<string>) => bool;

export type retryLastActionType = (reducerName: string | void) =>
  ThunkAction<void, {reducerName: lastActionType}>
