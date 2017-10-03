# redux-error-snapshot

Redux thunk utility that aims to ease the process of retrying last failed action.

--------------------------------

[![Travis](https://img.shields.io/travis/jkomyno/redux-error-snapshot.svg)](https://travis-ci.org/jkomyno/redux-error-snapshot)
[![npm](https://img.shields.io/npm/v/redux-error-snapshot.svg)](https://npmjs.com/package/redux-error-snapshot)
[![npm](https://img.shields.io/npm/dm/redux-error-snapshot.svg)](https://npmjs.com/package/redux-error-snapshot)
[![Issue Stats](https://img.shields.io/issuestats/i/github/jkomyno/redux-error-snapshot.svg)](http://github.com/jkomyno/redux-error-snapshot/issues)

Since v1.0.1 this package follows the rules of [Semantic versioning](http://semver.org/).

## Install

- `yarn add redux-error-snapshot`

Or, if you prefer using npm (but you shoudln't):

- `npm i -S redux-error-snapshot`

## Why

Because I found myself writing quite the same logic for handling the classic
`Generic Error: press to try again` button / popup in different apps.
It requires [redux-thunk](https://github.com/gaearon/redux-thunk) to leverage its getState() and dispatch() methods, which I'm fond of.

## What you get

Here's what this module provides out of the box:

### Reducer

```js
import { reducer as errorSnapshot } from 'redux-error-snapshot';
```

**You have to import it inside your store manually**. The simplest way would be adding it
as argument in your combineReducers function. For reference, take a look [here](http://redux.js.org/docs/api/combineReducers.html).

It contains the snapshot of the last catched error situation in the app, so you have:
- `error`: the error message
- `action`: the function that failed last time
- `args`: the same arguments passed to the action that failed
- `...otherProps`: every other property your error'd action returns, is going to be passed to the reducer as well

The initialState of the reducer is defined as following:

```js
initialState = {};
```

### Actions

```js
import {
  resetErrorState,
  retryLastAction,
} from 'redux-error-snapshot';
```

- `resetErrorState`: sets the errorSnapshot reducer to `initialState`, returning the type `RESET_ERROR_STATE`.
- `retryLastAction`: dispatches the action saved in the errorSnapshot reducer. If you have decided to import
the reducer with a name different than `errorSnapshot`, you can pass its name as argument. E.g.:

```js
import { reducer as MyErrorReducer } from 'redux-error-snapshot';
import { retryLastAction } from 'redux-error-snapshot';

// ...

dispatch(retryLastAction('MyErrorReducer'));
```

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

## License

[MIT](LICENSE)
