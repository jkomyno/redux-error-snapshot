// @flow
import {
  existsIn,
  selectProperty,
} from '../src/utils';
import { defaultReducerName } from '../src/config';
import type { reducerStoreGetStateType } from '../src/types';

describe('existsIn', () => {
  it ('should return true if and only if the value exists in array', () => {
    expect(existsIn('@@redux-form/STOP_SUBMIT', ['@@redux-form/*', 'NAVIGATION/Back'])).toBe(true);
    expect(existsIn('nope', ['should', 'not', 'be'])).toBe(false);
  });
});

describe('selectProperty', () => {

  const state: reducerStoreGetStateType = {
    [defaultReducerName]: {
      error: 'Random error',
      args: [],
      meta: {
        a: 'b',
      },
    },
    notDefault: {
      error: 'Some error',
      args: [1, 2, 3],
      meta: {
        c: 'd',
      },
    },
  };

  it ('should extract the correct property from the reducer in getState()', () => {
    expect(selectProperty('error')(state)).toBe('Random error');
    expect(selectProperty('args')(state)).toEqual([]);
    expect(selectProperty('meta')(state)).toEqual({ a: 'b' });

    expect(selectProperty('error')(state, 'notDefault')).toBe('Some error');
    expect(selectProperty('args')(state, 'notDefault')).toEqual([1, 2, 3]);
    expect(selectProperty('meta')(state, 'notDefault')).toEqual({ c: 'd' });
  });
});
