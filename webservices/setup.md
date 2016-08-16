Steps for setting up a new rails app at Intrepid.
Assumes you already have a Heroku account. Ownership to be transfered to webservices account.

1. Newest ruby & newest rails must be installed.
(Suspenders may provide the newest rails).

2. `gem install suspenders`

3. Download heroku toolbelt: toolbelt.heroku.com

4. `suspenders <application_name> --heroku true`

5. Transfer ownership on heroku

6. `cd <application_name>`

7. Add `gem "airbrake"` to your Gemfile. Run `rails generate airbrake <random string>`.

8. Create github repo, add application to repo
Make sure everyone else on the team has access

9. Open Gemfile

10. Add gem "versionist"

11. Add gem "active_model_serializers", "0.8.3"

12. Exit, run bundle

13. https://github.com/IntrepidPursuits/club-foreman-server/blob/master/spec/support/helpers/requests.rb
Copy the contents of this file into spec/support/helpers/requests.rb

Make sure to include it in your rails helper:

```
RSpec.configure do |config|
  # ...
  config.include Helpers::Requests, type: :request
end
```

14.
Include the json_spec gem in your Gemfile:

```
group :development, :test do
  # ...
  gem 'json_spec'
end
```

Make sure to include it in your rails helper as well:

```
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

16.
Copy over your .env file to .sample.env so others know what environment
variables are required to get the project running. Your .sample.env at this
point might look something like this:

```
# https://github.com/ddollar/forego
AIRBRAKE_API_KEY=1234
AIRBRAKE_PROJECT_ID=1234
ASSET_HOST=localhost:3000
APPLICATION_HOST=localhost:3000
PORT=3000
RACK_ENV=development
RACK_MINI_PROFILER=0
SECRET_KEY_BASE=development_secret
EXECJS_RUNTIME=Node
SMTP_ADDRESS=smtp.example.com
SMTP_DOMAIN=example.com
SMTP_PASSWORD=password
SMTP_USERNAME=username
WEB_CONCURRENCY=1
```

You will also want to make sure to add your `.env` file to your `.gitignore` as
to not push up any important keys to Github.
