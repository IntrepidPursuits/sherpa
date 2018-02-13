# Generating and using higher-order components in React apps using the `recompose` library

In this post, we'll discuss using the `recompose` library and higher-order components in React.  We'll touch on the following:

1. What are higher-order components and why are they useful?
2. What is `recompose` and how do we use it to generate higher-order components?
3. Resources

## I. What are higher-order components and why are they useful?

[Higher-order components (HOCs)](https://reactjs.org/docs/higher-order-components.html) are components that take a component as an argument and return a new component with additional functionality.  If you're familiar with the decorator pattern, this should ring a bell for you.

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

These can be useful in a number of situations. Below is a short list of examples, which we'll go through with examples momentarily:
1. DRYing up components.  Instead of duplicating shared functionality in two components, encapsulate it in an HOC that can wrap each component.
2. Adding state to presentational components
3. Determining which component to render given a condition (e.g. if user is authenticated)

## II. What is recompose?

[`recompose`](https://github.com/acdlite/recompose) is a library that provides two primary categories of functions:
* [HOCs](https://github.com/acdlite/recompose/blob/master/docs/API.md) built to solve common problems, such as `withState` to bestow state on presentational components or `lifecycle` to add lifecycle hooks.
* Utility functions, such as `compose`, a function that streamlines the syntax for using multiple HOCs, or `enhance`.

### HOCs provided by recompose

You can view a full list of the HOCs `recompose` provides here: https://github.com/acdlite/recompose/blob/master/docs/API.md

We'll touch on a few of them here.

#### `mapProps` / `withProps` / `defaultProps`

`mapProps` provides a function that intercepts the props passed into the __wrapper__ component and transforms them into a new set of props to pass to the __wrapped__ component.

Here's a simple example where we use `mapProps` to create a higher order component that will uppercase all prop values before passing them on to its wrapped component:

```js
// src/components/MyWrapperComponent/enhance.js
import { mapProps } from 'recompose'

// the function to be used to transform the props passed into the wrapper component
const propsMapper = props => {
  let transformedProps = {}
  Object.keys(props).map(prop => {
    let key = prop[0]
    let value = prop[1]
    transformedProps[key] = value.toUpperCase()
  })
  return transformedProps
}

// high order component function. When called with props, `enhance` will generate a component wrapping the component passed in.
export default enhance = mapProps(propsMapper)
```
```js
// src/components/MyWrapperComponent/index.js
import enhance from './enhance'

const MyWrappedComponent = ({
  name,
  address,
  email
}) = (
  <div className="container">
    <div className="name">{name}</div>
    <div className="address">{address}</div>
    <div className="email">{email}</div>
  </div>
)

export default enhance(MyWrappedComponent)
```
```js
import MyWrapperComponent from '/path/to/MyWrapperComponent'

// `MyWrappedComponent` will receive ``{ foo: "APPLE", bar: "BANANA" }`
<MyWrapperComponent foo="apple" bar="banana" />
```

`withProps` does the same but _also_ passes the untransformed props down to the wrapped component.

`defaultProps`, as you'd expect, "specifies propse to be passed by default to the base component".

#### `withHandlers`

The `withHandlers` HOC allows you to pass in different event handlers (e.g. handlers for `onChange` events), to a wrapped component.  (Note that you can pass handlers likes this in via `mapProps` as well, but there are some performance benefits to using `withHandlers` instead.)

#### `withState` / `withStateHandlers`

The `withState` HOC allows you to pass state, along with a function to update that state, to a wrapped component.  You can use this in combination with `withHandlers` to pass in multiple functions to change the state, or you can use `withStateHandlers` to do both in a single HOC.  See [the docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstate) for example code.

#### `branch`

`branch` is useful for rendering different components based on whether a condition is met.  We might use this if we want to render a login screen for unauthenticated users, a loading spinner until data has been loaded, or an error component if we encounter a server error.

#### `lifecycle`

The `lifecycle` HOC allows you to pass in functions to be called at different lifecycle points, for example `componentDidMount`.  See [the docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#lifecycle) for an example.

#### `renameProp` / `renameProps`

These HOCs allow you to rename props from the key used when they are passed in, to a key expected by the wrapped component.

#### The list goes on!

These are just a few of the HOCs provided by `recompose`.  Refer to the [full list](https://github.com/acdlite/recompose/blob/master/docs/API.md) for additional information.

### Utility functions - `compose`

In addition to providing these HOCs, `recompose` provides some utility functions to make them easier to work with.  The most commonly used of these is `compose`.

`compose` allows you combine multiple HOCs into a single HOC.  This is useful if, for example, you want to both use `mapProps` to transform props passed to the base and _also_ use `withState` to set state, `branch` to render different components, `lifecycle` to pass in lifecycle hooks, etc.

Let's update our example with `mapProps` to also pass in an `isCollapsed` state to our component:

```js
// src/components/MyWrapperComponent/enhance.js
import { mapProps, compose } from 'recompose'

const propsMapper = props => {
  let transformedProps = {}
  Object.keys(props).map(prop => {
    let key = prop[0]
    let value = prop[1]
    transformedProps[key] = value.toUpperCase()
  })
  return transformedProps
}

export default enhance = compose(
  mapProps(propsMapper),
  withState('isCollapsed', 'setIsCollapsed', true)
)
```

## III. Resources

Below are some resources (curated by @davidrf :prayer_hands:) for learning more about HOCs and `recompose`.  For examples of how we've used this in our react apps at Intrepid, ask @davidrf or others.  Enjoy!

* Andrew Clark - React Europe 2016: https://www.youtube.com/watch?v=zD_judE-bXk
* Nik Graf - React Europe 2017: https://www.youtube.com/watch?v=qJgff2spvzM
* Higher Order Components with Functional Patterns Using Recompose (if you have an egghead.io account): https://egghead.io/courses/higher-order-components-with-functional-patterns-using-recompose
* Recompose API: https://github.com/acdlite/recompose/blob/master/docs/API.md
