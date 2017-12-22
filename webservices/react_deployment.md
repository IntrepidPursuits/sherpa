# ReactJS App Deployment

## Overview

We usually deploy front end React apps as wholly separate codebases from whatever we are using as the back end server. This gives us great versioning flexibility as well as the ability to push new React code with zero downtime.

Using `webpack`, the entire React app can be compiled into a single JavaScript file that contains all the minified/transpiled/etc. React code, and the "bare" HTML file containing the React root DOM element and a links to the JavaScript. The important part is the link-- the Javascript file name (and HTML <script> tag) contain a unique hash created by `webpack` that serves as a version number. The HTML file is stored in a Redis instance, and the Javascript file is stored in an Amazon S3 bucket.

To ensure that routing is left to the React app (react-router), the server treats all matching web requests the same and pulls the requested version (or "current" if none specified) of the HTML from Redis. The React app then bootstraps itself once fetched from the S3 bucket.

See diagram here:

![reactjs](https://user-images.githubusercontent.com/2251694/34311649-c014a326-e72c-11e7-8e1c-88fa249af576.png)

With that in mind, deploying a React app has three parts:
* Building the compiled JavaScript file with `webpack`
* Pushing the file to an S3 bucket
* Create an entry in the Redis instance with a key of "current" and value of the HTML file containing the link to the React code

## Examples

#### Front end deployment scripts:

Northeastern (Ruby)
  * https://github.com/IntrepidPursuits/northeastern-isle-web-frontend/blob/master/deploy/bastion_deploy.rb
  * https://github.com/IntrepidPursuits/northeastern-isle-web-frontend/blob/master/Rakefile.rb


Eli Lilly (JavaScript)

* https://github.com/IntrepidPursuits/lilly-carb-log-react/tree/master/scripts

#### Back end routing:

Northeastern (Rails)
* Router:  https://github.com/IntrepidPursuits/northeastern-isle-server/blob/master/config/routes.rb#L75
* Controller:  https://github.com/IntrepidPursuits/northeastern-isle-server/blob/master/app/controllers/web_app_controller.rb

Eli Lilly (Phoenix)

* Router:  https://github.com/IntrepidPursuits/lilly-carb-log-server/blob/staging/web/router.ex#L56
* Controller: https://github.com/IntrepidPursuits/lilly-carb-log-server/blob/staging/web/controllers/api/page_controller.ex
