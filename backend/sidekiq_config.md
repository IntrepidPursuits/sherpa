##Sidekiq Background Job Configuration

This document outlines the configuration required for a Rails application using the Sidekiq gem for background job processing to be deployed on Heroku.

For detailed information, refer to:

* [https://github.com/mperham/sidekiq/wiki/Getting-Started]()
* [https://devcenter.heroku.com/articles/redistogo]()
* [https://devcenter.heroku.com/articles/scheduler]()

##Rails Configuration

####Gemfile

Include the sidekiq gem in the `Gemfile` and run install bundle.

```
  gem ‘sidekiq’
```

####Procfile

Add the following two lines in the `app/Procfile`.

```
  web: bundle exec puma -p $PORT -C ./config/puma.rb
  worker: bundle exec sidekiq -C config/sidekiq.yml
```

####Application.rb

Add the configuration line for sidekiq in the
`config/application.rb`.

```ruby
module AppName
  class Application < Rails::Application
    ...
    config.active_job.queue_adapter = :sidekiq
  end
end
```

####Sidekiq Initializer

Add a sidekiq initializer: `config/initializers/sidekiq.rb`

```ruby
# config/initializers/sidekiq.rb
#
# Perform Sidekiq jobs immediately in development,
# so you don't have to run a separate process.
# You'll also benefit from code reloading.
if Rails.env.development?
  require 'sidekiq/testing'
  Sidekiq::Testing.inline!
end
```

####Sidekiq YML File

Add a sidekiq yml file: `config/sidekiq.yml`

```ruby
---
:verbose: true
:namespace: sidekiq
:concurrency: <%= ENV.fetch('SIDEKIQ_CONCURRENCY', 25) %>
# Set timeout to 8 on Heroku, longer if you manage your own systems.
:timeout: <%= ENV.fetch('SIDEKIQ_TIMEOUT', 8) %>
:queues:
  - [critical, 4]
  - [high, 3]
  - [default, 2]
  - [low, 1]
```

####Environment Values

Add an environment value in the `.env file`.

```
SIDEKIQ_CONCURRENCY=3
SIDEKIQ_TIMEOUT=8
```

> If using a free Heroku dyno, be sure to set the Sidekiq concurrency to 3.



##Rails Jobs and Rake Tasks

We use two general flavors of background jobs:

1. those that run after a particular client action (e.g., sending an email on user sign up, send a push notification), and
2. those that we want to run at specified intervals (e.g. that pull data from other APIs)

Some jobs obviously may be used in both contexts.

For the latter, create a rake task that runs your job and schedule it to run at the necessary interval on Heroku using either the Heroku Scheduler addon or, if you want more fine-grained control, the Clockwork addon.

####Creating a Job

Create the job to run in a namespace, inheriting from ActiveJob::Base. as `jobs/namespace/job_name`.rb.

```ruby
class namespace::job_name < ActiveJob::Base
  queue_as :default

  def perform
    #add your process code here
  end
end
```

####Creating a Rake Task

Create a rake task to run the job in the tasks directory as `tasks/job_name.rake`.

```ruby
namespace :namespace do
  desc 'description of your rake task'
  task task_name: :environment do
    namespace::job_name.perform_later
  end
end
```

To run your rake task:

```
rake namespace:task_name
```

##Heroku Configuration

####Application Resources

In your Heroku application Resources:

* load the RedisTOGo add-on
* load the Heroku Scheduler add-on
* add a worker Dyno for sidekiq

####Application Settings
In your Heroku application Settings, make sure the following Config Vars are set.

* REDIS_PROVIDER
* REDISTOGO_URL			 	
* SIDEKIQ_CONCURRENCY		
* SIDEKIQ_TIMEOUT			

> The REDIS⎽PROVIDER must be set to REDISTOGO_URL

####Running a Rake Task
To run your rake task on Heroku:

```
heroku run rake namespace:task_name - a <app_name>
```
To run your rake task using Heroku Scheduler:

Select the Heroku Scheduler resource and schedule your task to run on a regular basis.
