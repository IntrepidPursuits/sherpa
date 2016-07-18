Steps for setting up a new rails app at Intrepid.
Assumes you already have a Heroku account. Ownership to be transfered to webservices account.

1. Newest ruby & newest rails must be installed.
(Suspenders may provide the newest rails).

2. `gem install suspenders`

3. Download heroku toolbelt: toolbelt.heroku.com

4. `suspenders <application_name> --heroku true`

5. Transfer ownership on heroku

6. cd <application_name>

7. `rails generate airbrake <random string>`

8. Create github repo, add application to repo
Make sure everyone else on the team has access

9. Open Gemfile

10. Add gem "versionist"

11. Add gem "active_model_serializers", "0.8.3"

12. Exit, run bundle

13. https://github.com/IntrepidPursuits/follow-app-server/blob/master/spec/support/helpers/requests.rb
Copy the contents of this file into spec/support/requests.rb

Make sure to include it in your rails helper:

```
RSpec.configure do |config|
  # ...
  config.include Helpers::Requests, type: :request
end
```

14.
Include the json_spec gem:

```
group :development, :test do
  # ...
  gem 'json_spec'
end
RSpec.configure do |config|
  # ...
  config.include JsonSpec::Helpers
end
```

15.
Enable the uuid extension in its own migration:

```
$ rails generate migration EnableUuidExtension
```

```
class EnableUuidExtension < ActiveRecord::Migration
  def change
    enable_extension 'uuid-ossp'
  end
end
```
