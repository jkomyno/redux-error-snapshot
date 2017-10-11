1.3.1 / 2017-10-11
==================

  * flow: general enhancement

1.3.0 / 2017-10-11
==================

  * reducer:
    - added reducerCreator, which allows the user to put certain types' RegEx patterns in a
    blacklist. Every action whose type dispatched matches one of the patterns of the blacklist
    is ignored by the reducer
  * flow:
    - converted `lastActionType` to [IntersectionType](https://flow.org/en/docs/types/intersections/)
    - ensure `snapshotErrorType` immutability
    - added `retryLastActionType`
    - added `reducerCreatorType`
    - added `existsInType`

1.2.1 / 2017-10-04
===================

  * reducer:
    - removed implicit properties: `...otherProps` from `state` in favor of passing an object called `meta`,
    mantaining the previous extensibility. Due to this, this update doesn't break 1.2.0
    - initialState now is `{ meta: {} }`

1.2.0 / 2017-10-04
===================

  * reducer:
    - removed explicit property: `possibleReasons` from `state` in favor of passing every property
    different from `error`, `action` and `args` to the reducer, to enable extensibility
    - initialState now is `{}`
  * tests: adapted to use `flow`
  * deps: added `babel-plugin-transform-object-rest-spread@^6.26.0`

1.1.0 / 2017-10-03
===================

  * reducer:
    - its state supports an additional property: `possibleReasons` of type `Array<string>`
    - initialState now isn't null
