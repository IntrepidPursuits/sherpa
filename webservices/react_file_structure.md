# Ideal File Structure for React apps (According to D-Rod)

In this post, we'll discuss the common file structure we use for React Apps. Following this structure provides a logical and consistent structure that will make your apps easier to navigate for other developers.

## Top Level File Structure
Not all of these folders will be used or neccessary on every project, and you may also find yourself wanting additional folders as needed. This file structure pertains to the React code itself, ignoring things like packages and `.gitignore`
```
src
├──api
├──components
├──constants
├──images
├──reducers
├──static
├──stores
├──styles
├──utils
└──main.js
```
Below we will discuss the individual sections in more detail. Keep in mind, this is an evolving format, so not every project you encounter will look exactly like this.

### api
The `api` folder is where your backend function calls will live. Usually it makes sense to create sub-folders that correspond to your api endpoints. Sometimes you might be communicating with multiple APIs, in these cases it is common to break the api folder into sub-folders that correspond with each api.

```
api
├──backend
│  ├──logout
│  │  └─index.js
│  └──users
│     ├──index.js
│     └──normalizers.js
├──instagram
└──spotify
```
The functions for a particular endpoint should live in the `index.js`. You may additionally use `normalizers.js` for formatting the responses.


### components
`components` will be where the majority of your display code lives. Of special note are the `App` and `UI` folders.

-`App` serves as the base of your application, all routes lead to `App`

-`UI` serves as a toolbox, containing components that span use across the entire application

-The remaining `*Page` folders will make up the meat of the application

```
components
├──App
│  ├──Root
│  │  ├──__tests__
│  │  │  └─index.js
│  │  └──index.jsx
│  └──Routes
│     ├──__tests__
│     │  ├─enhance.js
│     │  └─index.js
│     ├──enhance.js
│     └──index.jsx
├──HomePage
│  ├──Root
│  │  ├──__tests__
│  │  │  ├─enhance.js
│  │  │  └─index.js
│  │  ├──index.jsx
│  │  ├──enhance.js
│  │  └──styles.css
│  └──ComponentA
│     ├──__tests__
│     │  ├─enhance.js
│     │  └─index.js
│     ├──index.jsx
│     ├──enhance.js
│     ├──stories.jsx
│     └──styles.css
└──UI
   ├──Modal
   │  ├──__tests__
   │  │  ├─enhance.js
   │  │  └─index.js
   │  ├──index.jsx
   │  ├──enhance.js
   │  └──styles.css
   └──Button
```
We will break down the various sections of the components folder in more detail below:

#### components/App
`App` is the entry point to your React application.

--`App/Root` is the top component that renders all other components. It is responsible for rendering:

--`App/Routes` which contains all of the top level React route paths/components

----Generally `App/Routes` imports all the other `Root` components for each page (i.e. `HomePage/Root`) and uses them within the routes


#### components/* Page
It often makes sense to group components by the page that will render them. For example you might have `components/HomePage` and `components/ProfilePage`

--Similar to `App/Root`, `*Page/Root` is the component within a page that renders the other components of that page

##### components/* Page/GenericComponent
Most React components should abide by the following structure:
```
ComponentA
├──__tests__
│  ├─enhance.js
│  └─index.js
├──index.jsx
├──enhance.js
├──stories.jsx
└──styles.css
```
--`index.jsx` should house the *stateless* display code for the component.

--`enhance.js` should handle any business logic that the component will use.

--`stories.jsx` may be used for Storybook components. 

--`styles.css` as you may have guessed, contains the styling for this particular component.

--`__tests__/` will contain the files for properly testing your React component.

#### components/UI
`UI` is where you can store any components that will be used across your application. Typical examples would be a modal, button, dropdown or table component.
```
UI
├──Modal
│  ├──__tests__
│  │  ├─enhance.js
│  │  └─index.js
│  ├──index.jsx
│  ├──enhance.js
│  └──styles.css
└──Button
```

### constants
The `constants` folder is where you store your... constants. Things like colors, fonts and simple helpers.

### images
Fairly self explanatory, images are stored here.

### reducers
The `reducers` folder is where most of your redux interactions will live.
```
reducers
├───users
│  ├──actions.js
│  ├──index.js
│  └──selectors.js
└──index.js
```
--`module/actions.js` for your redux actions pertaining to the relevant module.

--`module/index.js`, where the reducers themselves will live.

--`module/selectors.js`, where you can place functions that grab specific data from the Redux state.

--`index.js` is where combineReducers should be called

### static

### store
The `store` folder should contain any middleware and configuration pertaining to the redux store.
```
store
├──middlewares
│  └──middleware.js
└──configureStore.js
```

### utils
The `utils` folder serves as the location for any functions that will be used across various parts of the application. It also has a `recompose` folder which contains useful HOCs that can be used in the compose chain.
```
utils
├──recompose
│  └──index.js
└──util.js
```

### main.jsx || index.jsx
`main.jsx` or `index.jsx` is where you add your React application to the DOM. This file should be kept very minimal, instantiating only what is necessary to get React up and running.




## Complete File Structure

```
src
├──api
│  └──logout
│        └──index.js
├──components
│  ├──App
│  │  ├──Root
│  │  │  ├──__tests__
│  │  │  │  └─index.js
│  │  │  └──index.jsx
│  │  └──Routes
│  │     ├──__tests__
│  │     │  ├─enhance.js
│  │     │  └─index.js
│  │     ├──enhance.js
│  │     └──index.jsx
│  ├──HomePage
│  │  ├──Root
│  │  │  ├──__tests__
│  │  │  │  ├─enhance.js
│  │  │  │  └─index.js
│  │  │  ├──index.jsx
│  │  │  ├──enhance.js
│  │  │  └──styles.css
│  │  └──ComponentA
│  │     ├──__tests__
│  │     │  ├─enhance.js
│  │     │  └─index.js
│  │     ├──index.jsx
│  │     ├──enhance.js
│  │     ├──stories.jsx
│  │     └──styles.css
│  └──UI
│     ├──Modal
│     │  ├──__tests__
│     │  │  ├─enhance.js
│     │  │  └─index.js
│     │  ├──index.jsx
│     │  ├──enhance.js
│     │  └──styles.css
│     └──Button
├──constants
│  ├──colors.scss
│  ├──index.js
│  └──values.js
├──images
│  └──image.png
├──reducers
│  ├───users
│  │  ├──actions.js
│  │  ├──index.js
│  │  └──selectors.js
│  └──index.js
├──static
├──store
│  ├──middlewares
│  │  └──middleware.js
│  └──configureStore.js
├──styles
├──utils
│  ├──recompose
│  │  └──index.js
│  └──util.js
└──main.js
```