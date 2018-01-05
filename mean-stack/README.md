# MEAN-Stack

MEAN is an acronym for MongoDB, Express, Angular and Node.  This will
be the stack we'll be using a lot in the near future. This document is
meant to collect resources used in MEAN applications.  Note that
occasionally, other frameworks insert themselves into the basic MEAN
stack, calling them selves MEARN or MERN (by adding React and still
possibly including Angular).

## The primary stack

* [MongoDB](https://www.mongodb.com)

MongoDB is a NoSQL database based on key-value store which is usually
best for data that doesn't necessarily conform to rows and
columns. The name comes from the middle of the word "Humongous.  It's
an open-source cross-platform document oriented database program.
Around since 2007, the first release was in 2009.

You can use Mongodb by itself (it has a command line provided by the
`mongo` command) or with an ORM resource on top of MongoDB. For Node
applications, we generally use the Mongoose Object Relational Mapper
(ORM).

* [Express](https://expressjs.com)

Express is a web application framework based on Node.js.  It is a
minimal server inspired by Sinatra and is commonly used as the backend
of the MEAN stack together with MongoDB.  Many more features are
available as plug-ins.

* [Angular](https://angular.io)

Angular refers to the 2.x version of Angular opposed to AngularJS
which usually refers to the 1.x version.  The latest version is 5.x.

* [Node](https://nodejs.org/en)

Node.js is an open-source Javascript run-time environment for
executing server-side Javascript code. Initial release was 2009.

## Related tools

* [GraphQL](http://graphql.org)

GraphQL is a query language for APIs used to provide a description of
the data in an API.  That is, GraphQL allows an API provider to lay
out all of the types of questions that the API can answer.

* [Webpack](https://webpack.js.org)

Webpack is a module bundler.  It takes modules and dependencies and
generates static assets that represent those modules.  It also can
generate a dependency graph to help developers create more modular web
application designs.

* [Gulp](https://gulpjs.com)

Gulp is an open-source JavaScript toolkit created by Fractal
Innovations and the community at GitHub.  It is used as a streaming
build system and task runner for fron-end web development.  It uses a
code-over-configuration approach to define tasks. It has over 300
plug-ins to choose rom to build tools.

Gulp can be used to serve the sites generated with the help of Yeoman.

* [Babel](https://babeljs.io)

Babel JS is a transpiler for Javascript. It can take the latest
version of JavaScript, Typescript or EC6 and produce code for older
browsers.

* [React](https://reactjs.org)

* [Redux](https://redux.js.org/)

Redux is a predictable state container for Javascript apps.  [Note
that Redux-framework is also the name of a Wordpress framework; that
framework is at https://reduxframework.com.] Redux can be used with
React or with any other view library.  It's 2k size including
dependencies helps with this. Note that React and Redux are *not* part
of the MEAN stack, but are sometimes roped in (calling it Mern or
something else).

* [Yarn](https://yarnpkg.com/en/)

Yarn is a package manager. It manages packages and dependencies.
Technially, Yarn is a superset of NPM that solves many of the problems
with NPM.  Yarn has its own lock file (yarn.lock) that takes the place
of package-lock.json that npm 5 uses. However, some testing shows that
yarn is still faster than NPM for some of the same tasks. From a Rails
perspective, the version 5.1 of Rails has replaced the Rails Asset
Pipeline with Webpack and Yarn.

* [Mocha](https://mochajs.org)

Mocha is a Javascript test framework that runs under Node.js.It's
initial release was November 2011.

* [Sass Loader for Webpack](https://github.com/webpack-contrib/sass-loader)

Loads a SASS / SCSS file and compile it to CSS. Use the css-loader or
the raw-loader to turn it into a JS module and the ExtractTextPlugin
to turn it into a separate file.

* [Boostrap Sass](https://github.com/twbs/bootstrap-sass#d-npm--nodejs)

Bootstrap-sass is a sass-powered version of Bootstrap 3, ready to drop
right into your sass powered applications.

* [Node-Sass](https://github.com/sass/node-sass)

Node-sass is a library that provides bindings for Node.js to LibSass,
which is the C version of the stylesheet preprocessor, Sass.

* [Neat (a Sass grid)](https://neat.bourbon.io/)

Neat is a lightweight and flexible Sass grid. It will work with Bower,
Ruby or NPM. There is also a `neat-cli` tool to install Neat into the
current directory.

* [Bourbon](https://github.com/thoughtbot/bourbon)

A lightweight Sass Toolset.  Bourbon is a library of Sass mixins and
functions to make you a more efficient stylesheet author.

* [EJS](http://ejs.co/ "Effective Javascript Templating")

This is a simple templating method that lets you generate HTML code
from JS templates.

* [HAML](http://haml.info/)

HTML Abstraction Markup Language.  Another templating tool to generate
HTML from formatted files that look approximately like YAML files.

* [Passport](http://www.passportjs.org/docs/)

Passport is authentication middleware for Node.  Passport delegates
all other functionality to the application besides authentication
requests.

* [Jade language](http://jade-lang.com/)

Jade is a node templating engine. It uses input similar to Haml, in
the sense that they are both indented and that the indentation shows
the level of nesting in the generated HTML code.  Note that Jade has
more features to handle inline JS code than HAML. It looks like Jade
is the same as Pug; not sure about this, though.

* [Pug (Jade)](https://pugjs.org/api/getting-started.html)

* [Flow](https://flow.org/)

Flow is a static typechecker for Javascript. Using it involves adding
some types to JS code so that Flow can recognize usage patterns and
check the code.  The types are stripped when the code is transpiled by
Babel. The transpiling process happens anyway during final asset
creation when JS code is minified. Using Babel allows us to use the
latest JS coding techniques knowing that the code will be transpiled
in such a way as to make backward compatible all of the newer features
for older browsers.


## Questions

* Where do tests go?
* How to run tests?
* Which tests are created automatically?
* What about Authentication?
* How to deliver my findings.
  * Note that a few of the apps that I'm pointing out are *already*
    Github apps.  So I need a way to not re-deliver those, but just
    links to them.
