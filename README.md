# redux-error-snapshot

Redux thunk utility that aims to ease the process of retrying last failed action.

--------------------------------

[![Travis](https://img.shields.io/travis/jkomyno/redux-error-snapshot.svg)](https://travis-ci.org/jkomyno/redux-error-snapshot)
[![npm](https://img.shields.io/npm/v/redux-error-snapshot.svg)](https://npmjs.com/package/redux-error-snapshot)
[![npm](https://img.shields.io/npm/dm/redux-error-snapshot.svg)](https://npmjs.com/package/redux-error-snapshot)
[![Issue Stats](https://img.shields.io/issuestats/i/github/jkomyno/redux-error-snapshot.svg)](http://github.com/jkomyno/redux-error-snapshot/issues)

Since v1.0.1 this package follows the rules of [Semantic versioning](http://semver.org/).

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Motivation](#motivation)
- [Api reference](#api-reference)
  - [reducer](#reducer)
    - [reducerCreator](#reducercreator)
  - [actions](#actions)
    - [resetErrorState](#reseterrorstate)
    - [retryLastAction](#retrylastaction)
  - [selector](#selector)
- [Typings](#typings)
- [Available scripts](#available-scripts)
- [Related Projects](#related-projects)
- [License](#license)

## Overview

Every time a dispatched action has an `error` property, `redux-error-snapshot` takes care of
saving a snapshot of the error'd state in its reducer, which is exposed to the user, and also
provides a set of utilities to try again the last failed action with the same exact arguments.
The user can also decide to *hide* some actions (which have the property `error`) to the reducer:
for more informations about this possibility, checkout [**reducerCreator**](#reducercreator).

## Installation

- `yarn add redux-error-snapshot`

Or, if you prefer using npm ([but you shouldn't](https://medium.com/@kaayru/what-is-yarn-and-should-we-use-it-dbd8c46de6a)):

- `npm i -S redux-error-snapshot`

It requires [redux-thunk](https://github.com/gaearon/redux-thunk) since this library leverages its
`getState()` and `dispatch()` methods.

You also need [reselect](https://github.com/reactjs/reselect) if you want to use the selector
provided.

## Motivation

*Why did you create this library?*, you may ask?
The reason is that I found myself writing quite the same logic for handling the classic
`Generic Error: press to try again` button / popup in different apps. When you continuosly
repeat something, there's certainly room for improvement, so here's my shot with this little
package, that hopefully will be usuful to somebody else as well.

## API reference

```js
import {
  resetErrorState,
  retryLastAction,
  reducerCreator,
  reducer as errorSnapshot,
  selector as getErrorSnapshot,
} from 'redux-error-snapshot';
```

- **Actions**:
  - `resetErrorState: ()`
  - `retryLastAction: (reducerName = 'errorSnapshot')`

- **Reducer**:
  - `errorSnapshot: (state = INITIAL_STATE, action)`
  - `reducerCreator: (blacklist = [])`

- **Selector**:
  - `getErrorSnapshot: (store.getState(), reducerName = 'errorSnapshot')`

### Reducer

```js
import { reducer as errorSnapshot } from 'redux-error-snapshot';
```

**You have to import it inside your store manually**. The simplest way would be adding it
as argument in your combineReducers function, like showed in the example below.
For reference, take a look [here](http://redux.js.org/docs/api/combineReducers.html).

```js
// reducers.js
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as errorSnapshot } from 'redux-error-snapshot';
import todo from './todo';

const rootReducer = combineReducers({
  errorSnapshot,
  todo,
});

export default rootReducer;
```

```js
// store.js
import {
  createStore,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const initialState = {};
const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunk),
);

export default store;
```

It contains the snapshot of the last catched error situation in the app, so you have:
- `error`: the error message
- `action`: the function that failed last time
- `args`: the same arguments passed to the action that failed
- `meta`: general object

The initialState of the reducer is defined as following:

```js
initialState = {
  meta: {},
  args: [],
};
```

How to correctly populate the reducer:

```js
  const yourThunkAction = (arg1, arg2) =>
    async (dispatch, getState) => {
      try {
        // your code here
      } catch (err) {
        // example meta structure
        const meta = {
          reason: err.message,
          trace: err.stack,
        };

        dispatch({
          type: 'YOUR_ERROR_TYPE',
          action: yourThunkAction,
          // you need and `error` string property to create a snapshot
          error: 'Oops, something went wrong while executing yourThunkAction',
          args: [arg1, arg2],
          meta,
        });
      }
    }
```

Note that you can store what you want in `meta`, and since v1.2.1 you can simply access its children without checking that meta isn't null first.

```diff
+import React, { PureComponent } from 'react';
+import { connect } from 'react-redux';
+import { retryLastAction } from 'redux-error-snapshot';
+
+class YourComponent extends PureComponent {
+  
+  getReason = () => {
+    const { meta } = this.props.errorSnapshot;
-    return meta && meta.reason;
+    return meta.reason;
+  }
+
+  // ...
+}
+
+const mapStateToProps = ({ errorSnapshot }) => ({
+  errorSnapshot,
+});
+
+export default connect(mapStateToProps, { retryLastAction })(YourComponent); 
```

### reducerCreator

```js
import { reducerCreator as errorSnapshotCreator } from 'redux-error-snapshot';
```

You can also decide to *hide* some actions which have the property `error`.
You just need to define a blacklist array with the types' RegEx patterns.
Every action whose type dispatched matches one of the patterns of the blacklist
is automagically ignored by the reducer.

Note that `reducerCreator` has this name because it is a curried function which accepts an array
of strings as only parameter, and returns the same reducer described above.

Example:

```js
// reducers.js
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducerCreator as errorSnapshotCreator } from 'redux-error-snapshot';
import todo from './todo';

const rootReducer = combineReducers({
  /*
  force redux-error-snapshot to ignore actions with types such as
  '@@redux-form/SUBMIT_FAILED'
  */
  errorSnapshot: errorSnapshotCreator(['@@redux-form/*']),
  form,
  todo,
});

export default rootReducer;
```

### Actions

```js
import {
  resetErrorState,
  retryLastAction,
} from 'redux-error-snapshot';
```

The available actions are:

- `resetErrorState`: sets the errorSnapshot reducer to `initialState`, returning the type `RESET_ERROR_STATE`.
- `retryLastAction`: dispatches the action saved in the errorSnapshot reducer. If you have decided to import
the reducer with a name different than `errorSnapshot`, you can pass its name as argument.

Example:

```js
import { reducer as MyErrorReducer } from 'redux-error-snapshot';
import { retryLastAction } from 'redux-error-snapshot';

// ...

dispatch(retryLastAction('MyErrorReducer')); // automatically resets the reducer state
```

### Selector

```js
import { selector as getErrorSnapshot } from 'redux-error-snapshot';
```

Selectors are an efficient and composable way of extracting data from a reducer (you can take a
look at the awesome documentation provided by [reselect](https://github.com/reactjs/reselect)
about selectors).
The first argument of a selector is familiar to many redux developers, since it expects
`store.getState()`. The next argument however, is optional: again, if you have decided to import
the reducer with a name different than `errorSnapshot`, you can pass its name as second argument.

Example:

## Typings

This project uses Flow as its type system. It automatically exports *.flow files, but not *.ts. If you do know
how to automatically export TypeScript bindings without writing the same types twice, please let me know by
opening a Pull Request.

## Available Scripts

- `clean`: Deletes the compiled lib folder;
- `build`: Runs the clean script, transpiles the code with babel to the lib folder and copies the flow references;
- `build:watch`: Runs the build script in watch mode
- `lint`: Runs eslint
- `flow`: Verifies if there are flow errors;
- `test`: Runs the test suites with jest;
- `test:watch`: Runs the tests in watch mode;
- `test:cov`: Runs the tests and displays coverage (which should't get below 100%!)
- `test:ci`: Tests lint, flow, and jest errors

You can build your own light version of setting the env.targets property in .babelrc to `"node": "current"`.
The version deployed to npm requires NodeJS 6.11.3, which is the current LTS as of September 2017.

## Related Projects

- [redux-error-snapshot-immutable](https://github.com/jkomyno/redux-error-snapshot-immutable):
  it's essentially a fork of this library which uses [immutable](https://github.com/facebook/immutable).

## License

This project is [MIT](LICENSE) licensed.
