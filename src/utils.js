// @flow
import { defaultReducerName } from './config';
import type {
  existsInType,
  selectorCreatorType,
} from './types';

/**
 * Returns true if and only if the pattern of the value exists in array.
 */
export const existsIn: existsInType = (value, array) =>
  array.reduce((prev, curr) => prev || RegExp(curr).test(value), false);

/**
 * Returns a selector to the the specified `property` of the reducer `reducerName`
 */
export const selectProperty: selectorCreatorType = property =>
  (state, reducerName = defaultReducerName) =>
    state[reducerName][property];
