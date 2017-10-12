// @flow
import type { ThunkAction } from 'redux-thunk';

export type genericThunkActionCreatorType = (...args: Array<any>) => ThunkAction<void, {reducerName: lastActionType}>;

export type snapshotErrorType = {
  +error?: string,
  +action?: genericThunkActionCreatorType,
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

export type reducerStoreGetStateType = {
  [string]: snapshotErrorType,
};

export type reducerCreatorType = (blacklist?: Array<string>) => reducerType;

export type existsInType = (value: string, array: Array<string>) => bool;

export type retryLastActionType = (reducerName: string | void) =>
  ThunkAction<void, {reducerName: lastActionType}>

export type selectorCreatorType = (property: string) =>
  (state: reducerStoreGetStateType, reducerName?: string) =>
    any;
