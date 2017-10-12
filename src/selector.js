// @flow
import { createSelector } from 'reselect';
import { selectProperty } from './utils';

export default createSelector(
  selectProperty('error'),
  selectProperty('action'),
  selectProperty('args'),
  selectProperty('meta'),
  (error, action, args, meta) => ({
    error,
    action,
    args,
    meta,
  }),
);
