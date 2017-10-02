import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  resetErrorState,
  retryLastAction,
} from '../src/actions';
import reducer from '../src/reducer';
import { RESET_ERROR_STATE } from '../src/reduxTypes';
import { defaultReducerName } from '../src/config';

const expectedResetAction = {
  type: RESET_ERROR_STATE,
};

const mockStore = configureStore([thunk]);

describe('reducer', () => {
  const initialState = null;

  it ('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it ('should not affect state', () => {
    expect(reducer(undefined, {
      type: 'RANDOM_ERROR_TYPE',
    })).toEqual(initialState);
  });

  it ('should reset the reducer', () => {
    expect(reducer(undefined, resetErrorState())).toEqual(null);
  });

  it ('should return an object with props `error`, `action`, `args`', () => {
    const expectedState = {
      error: 'randomError',
      action: jest.fn(),
      args: [],
    };

    expect(reducer(undefined, Object.assign({
      type: 'RANDOM_ERROR_TYPE',
    }, expectedState))).toEqual(expectedState);
    expect(expectedState.action).not.toBeCalled();
  });
});

describe('actions', () => {
  it ('should create an action to reset the reducer', () => {
    expect(resetErrorState()).toEqual(expectedResetAction);
  });

  it (`if the argument isn't a string, the reducerName should default to ${defaultReducerName} and
       work correctly, without throwing an error due to trying to access properties of undefined.`, () => {
    const lastAction = jest.fn(() => ({
      type: 'RANDOM_ERROR_TYPE',
    }));

    const expectedState = {
      action: lastAction,
      args: [],
    };

    const store = mockStore({
      [defaultReducerName]: {
        type: 'RANDOM_ERROR_TYPE',
        action: lastAction,
        args: [],
      },
    });

    expect(() => {
      store.dispatch(retryLastAction());
    }).not.toThrow();
    
    const expectedActions = [
      expectedResetAction,
      { type: 'RANDOM_ERROR_TYPE' },
    ];

    expect(store.getActions()).toEqual(expectedActions);
    expect(lastAction).toBeCalled();
  });
});

describe('freeze-error-state', () => {
  const mockedAction = (arg1, arg2, arg3) => (
    dispatch => {
      try {
        // ...
        throw new Error('Something went wrong');
      } catch (error) {
        dispatch({
          type: 'RANDOM_ERROR_TYPE',
          error: error.message,
          action: mockedAction,
          args: [
            arg1,
            arg2,
            arg3,
          ],
        })
      }
    }
  );
  const args = [1, 2, 3];
  const expectedAction = {
    error: 'Something went wrong',
    action: mockedAction,
    args,
  };

  it (`should send a thunk which will throw, and the catched error will be dispatched along
      with the action that threw and its arguments`, () => {

    const store = mockStore();
    store.dispatch(mockedAction.apply(null, args));

    expect(store.getActions()).toEqual([Object.assign({
      type: 'RANDOM_ERROR_TYPE',
    }, expectedAction)]);
  });

  it ('should retrieve last action, arguments and error message', () => {
    const newStore = mockStore({
      [defaultReducerName]: expectedAction,
    });

    newStore.dispatch(retryLastAction(defaultReducerName));

    const expectedActions = [
      expectedResetAction,
      Object.assign({
        type: 'RANDOM_ERROR_TYPE',
      }, expectedAction),
    ];
    expect(newStore.getActions()).toEqual(expectedActions);
  });
})
