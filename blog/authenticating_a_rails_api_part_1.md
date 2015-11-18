## So you want to sign up users and authenticate your Rails API - Step 1

Hi folks. My name is Helen and I'm a Rails developer at Intrepid. That's right, we don't just do mobile. We also have a small but mighty web team that builds APIs, admin portals, and the like for our clients. And we're hiring!  Hit us up.

It seems like every time we get a new crop of apprentices or start on a new project we ask ourselves: "Er, how do we do handle user sign up and authentication again?"

And then we think: "Shouldn't we have written this down somewhere last time?"

Yes, yes we should have. So now we are, for our and your benefit.

Over the last few projects, we've come up with a fairly consistent approach to authenticating our APIs, which I'll outline in this and future blog posts. In this post, I'll review signing up users with email and password.  In future posts, I'll review:
- allowing users to sign up via either email/password or an OAuth provider
- authenticating API endpoints using [warden](https://github.com/hassox/warden).
- regenerating API tokens when they expire

### Overview

Here's the whole sign-up and authentication flow:

1. User signs up
  * A first-time user submits their email and password to a `POST /users` endpoint.
  * They get back a unique `authentication_token` to pass up in subsequent requests.
2. User makes a request to an authenticated endpoint in your API
  * They pass up their `authentication_token` in an `Authorization` header.
  * If a user with that auth token exists and the auth token is not expired, the request proceeds.
  * Otherwise, the server returns a `401 - Unauthorized` response.
3. User regenerates a token
  * If their token has expired, the user submits their email and password to a `POST /authentications` endpoint.
  * A new token is generated for that user and is returned for use in subsequent requests.

We'll tackle parts 1 and 3 today.  Follow along on [this repo](https://github.com/IntrepidPursuits/api-authentication-demo).

### Tools we'll use

- [ActiveModel::Serializers v. 0.8.3](https://github.com/rails-api/active_model_serializers/tree/0-8-stable)
- [Monban](https://github.com/halogenandtoast/monban) and [Warden](https://github.com/hassox/warden)
- RSpec and [json_spec](https://github.com/collectiveidea/json_spec) gem for testing
- [Versionist](https://github.com/bploetz/versionist) for versioning the API

### Let's get started

#### Step 1: Write a test

Because we're good little TDD-ers, we'll start with an integration test for our "happy path" case:

```ruby
# /spec/requests/v1/users_requests_spec.rb

require 'rails_helper'

describe 'Users endpoints' do
  describe 'POST /users' do
    context 'with valid email and password' do
      it 'returns JSON for a user' do
        user_attributes = {
          user: {
            email: user.email,
            password: user.password_digest
          }
        }.to_json

        post(users_url, user_attributes, accept_headers)

        expect(response).to have_http_status :ok
        expect_response_to_include_user_info
      end
    end
  end

  def user
    @user ||= build(:user)
  end

  def expect_response_to_include_user_info
    expect(json_value_at_path('user/email')).to eq user.email
    expect(json_value_at_path('user/authentication_token')).to be
    expect(json_value_at_path('user/authentication_token_expires_at')).to be
  end
end
```

We're making use of a couple of helper methods in our test that we can define in a `Helpers::Requests` mixin, namely:

* `accept_headers` to generate a header with our vendor prefix and API version number
* `json_value_at_path` for validating that JSON responses contain the correct values

These rely on the `json_spec` gem's [helper methods](https://github.com/collectiveidea/json_spec#rspec), namely `parse_json`.

```ruby
# spec/support/helpers/requests.rb

module Helpers
  module Requests
    def body
      response.body
    end

    def json_value_at_path(path = '')
      parse_json(body, path)
    end

    def api_version
      1
    end

    def accept_header
      "application/vnd.authentication-demo-app.com; version=#{api_version}"
    end

    def accept_headers
      { 'Accept' => accept_header,
        'Content-Type' => 'application/json' }
    end
  end
end
```

Remember to register this helper, as well as the `json_spec` helpers, in your `rails_helper.rb`:

```ruby
RSpec.configure do |config|
  # ...
  config.include Helpers::Requests, type: :request
  config.include JsonSpec::Helpers
  # ...
end
```

#### Step 2: Generate your user model

Let's add a `User` model with `email`, `password_digest`, `authentication_token`, and `authentication_token_expires_at` required fields ([commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/20a49ca1b8f74b8e6834f99bd8ee66f3d0200a4es)).

#### Step 3: Add your route and controller action

We use the [versionist](https://github.com/bploetz/versionist) gem to enable versioning via an accept header.  Adding the route below:

```ruby
# config/routes.rb

Rails.application.routes.draw do
  api_version(module: 'V1',
              header: {
                name: 'Accept',
                value: 'application/vnd.authentication-demo-app.com; version=1' },
              defaults: { format: :json }) do
    resources :users, only: :create
  end
end
```

will give us a route to the `v1/userss#create` controller action.  In that action, we'll use a `SignUpUser` service and an `AuthenticationSerializer` to serialize the user into JSON:

```ruby
# app/controllers/v1/users_controller.rb

class V1::UsersController < V1::ApplicationController
  def create
    user = SignUpUser.perform(user_params)
    render json: user, serializer: AuthenticationSerializer, root: :user
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
```

([commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/e8975beba4523f9c7803c494c15e885f7d9d5bc7))

#### Step 4: Add SignUpUser service

The `SignUpUser` service is responsible for creating a new user given an email and password. We'll be using [Monban](https://github.com/halogenandtoast/monban) to sign up users.

In addition to the `SignUpUser` service, we'll need to add:
- A `reset_token!` method on the `User` model to set the authentication token, which we'll be able to use later on when we need to regenerate tokens as well.
- An `AuthenticationToken` service, which will hold the logic for generating new (unique) tokens.

Here's the [code](https://github.com/IntrepidPursuits/api-authentication-demo/commit/47b9d801648e85c58589e0648790833fd58f0dd1).

#### Step 5: Add AuthenticationSerializer

Our last step is to add an `AuthenticationSerializer` to serialize our newly-signed up user.

First let's add a `BaseSerialier` that our other serializers will inherit from, which will include basic attributes and ensure that any associated records are [sideloaded rather than embedded](https://github.com/rails-api/active_model_serializers/tree/0-8-stable#embedding-associations).

```ruby
# app/serializers/base_serializer.rb

class BaseSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at

  embed :ids
end
```

Now let's add our `AuthenticationSerializer` and return the user's token and expiry:

```ruby
# app/serializers/authentication_serializer.rb

class AuthenticationSerializer < BaseSerializer
  attributes :email, :authentication_token, :authentication_token_expires_at
end
```

Our happy path request spec should now be passing!

#### Step 6: Handle error cases

Finally, we need to make sure that error cases (such as a user providing a pre-existing email) are handled properly.

In this case, we want to return a "422 - Unprocessable entity" response along with helpful error messages.  Let's add our integration test:

```ruby
# /spec/requests/v1/users_requests_spec.rb

context 'with errors' do
  context 'such as a pre-existing email' do
    it 'returns a 422 response and JSON for errors' do
      existing_user = create(:user)

      user_attributes = {
        user: {
          email: existing_user.email,
          password: user.password_digest
        }
      }.to_json

      post(users_url, user_attributes, accept_headers)

      expect(response).to have_http_status :unprocessable_entity
      expect(json_value_at_path('errors/0')).to eq 'Email has already been taken'
    end
  end
end
```

And now let's make it pass:

```ruby
# app/controllers/v1/users_controller.rb

def create
  user = SignUpUser.perform(user_params)

  if user.save
    render json: user, serializer: AuthenticationSerializer, root: :user
  else
    render json: { errors: user.errors.full_messages },
           status: :unprocessable_entity
  end
end
```

([commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/6559f931049bd163a2e6649ffeb358d7929c02ec))

We could leave it like this and be done with our feature.  But since we nearly always this pattern in `create` actions of trying to save an object and rendering errors if it fails, let's instead raise an error and rescue that error in our base controller:

```ruby
# app/services/sign_up_user.rb

def sign_up_user
  user.tap do |user|
    user.reset_token!
    user.save! # raise error if validation fails
  end
end
```

```ruby
# app/controllers/v1/users_controller.rb

def create
  user = SignUpUser.perform(user_params)
  render json: user, serializer: AuthenticationSerializer, root: :user
end
```

```ruby
# app/controllers/application_controller.rb

class ApplicationController < ActionController::Base
  # ...

  rescue_from ActiveRecord::RecordInvalid do |exception|
    render json: { errors: exception.message }, status: :unprocessable_entity
  end
end
```

[commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/fa1920508491249459183827417aba3d72f5b56e)

### That's it!

Congratulations, you can now sign up users.

Let us know if you have feedback or questions!  And stay tuned for our next post in the series.
