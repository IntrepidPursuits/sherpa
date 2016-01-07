## Heroku

If you created your app by running `suspenders app_name --heroku true`, your life will be slightly easier when deploying to Heroku.  This flag:

* Creates a staging and production Heroku app
* Sets them as staging and production Git remotes
* Configures staging with RACK_ENV and RAILS_ENV environment variables set to staging
* Adds the Rails Stdout Logging gem to configure the app to log to standard out, which is how Heroku's logging works.
* Creates a Heroku Pipeline for review apps

(from the [readme](https://github.com/thoughtbot/suspenders))

It also adds the `rails_12factor` gem which is necessary for deploying a Rails app to Heroku.

Deployment in this case is simply a matter of:

(1) Setting all the necessary environment variables, either via the Heroku command line:

  ```
  heroku config:set ENV_VAR_NAME=value -a name-of-heroku-app
  ```
or via the Heroku Dashboard.

(2) Running the deploy script, passing in the environment:

  ```
  ./bin/deploy staging
  ```

If you did not use the `--heroku true` flag, or did not use suspenders to generate your app, there are a few more steps:

(1) Create an app on the Heroku dashboard (one for staging & one for production)
(2) Add each as a git remote:

  ```
  git remote add staging git@heroku.com:<my-heroku-staging-app-name>.git
  git remote add production git@heroku.com:<my-heroku-production-app-name>.git
  ```

(3) Add the `rails_12factor` gem to your staging and production groups:

  ```ruby
  group :staging, :production do
    gem 'rails_12factor'
  end
  ```

(4) Set all config variables.  Consult your `.env` file and prior projects for example values.
* Certain Heroku addons set their own environment variables.  For example, you must add the Airbrake addon before deploying if you have the Airbrake gem installed.  Provisioning the addon will set the necessary environment variables for you.
* Forgetting to set an environment variable is the most common reason initial deployments fail.

(5) Push to Heroku, migrate your database, and run a seeder as necessary.

  ```
  $ git push staging master
  $ heroku run rake db:migrate -a <my-heroku-staging-app-name>
  ```

  If you have seed data that has not yet been added to the database, you'll also want to run your seeder:

  ```
  $ heroku run rake db:seed -a <my-heroku-production-app-name>
```
