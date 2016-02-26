## So you want to sign up users and authenticate your Rails API - Part 2

**Note:** This tutorial is designed for someone who has a beginning to intermediate knowledge of Ruby on Rails.

In our last post, we reviewed signing up users via a `POST /users` endpoint in our API.  In this episode, we'll review how we authenticate users using an authentication token passed in the authorization header.

### Overview

We use [warden](https://github.com/hassox/warden) to authenticate our endpoints.  Warden lets you define custom strategies for restricting access to routes in your application. This is especially useful if you have different authentication rules for different endpoints.

In this post, we'll create a `GET /widgets` endpoint that can only be accessed by our users.  We'll require users to pass up their authentication token in an authorization header like so:

```
GET /widgets
Authorization: Token token=<my_token_here>
```

There are three components we'll need to implement:
(1) A **constraint** to wrap our routes:

    ```ruby
    constraints AuthenticatedConstraint.new do
      resources :widgets
    end
    ```

(2) The Warden **strategy** that the constraint uses.
(3) A **method** on our `User` model that will find a user given an authentication token.  Our strategy will use this method.

### Tools we'll use

- [Warden](https://github.com/hassox/warden)
- RSpec and [json_spec](https://github.com/collectiveidea/json_spec) gem for testing

### Let's get started

#### Step 1: Write a test

By the time we get to implementing an authentication system, we usually have at least one endpoint that requires authentication. So let's start with a `GET /widgets` endpoint that we want to restrict access to. ([commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/1d7756e182e455c6b3cface10e349c249d3b1682))

Now let's add a test in our `widgets_requests_spec.rb` that ensures that a 401 status is returned if an unauthenticated user tries to access our endpoint:

```ruby
describe 'WidgetsController endpoints' do
  describe 'GET /widgets' do
    context 'with authenticated user' do
      # ...
    end

    context 'without authenticated user' do
      it 'returns a 401 - Unauthorized response' do
        get(widgets_url, {}, accept_headers)

        expect(response).to have_http_status :unauthorized
      end
    end
  end
end
```

This test should fail.

#### Step 2: Add a constraint

Rails' [constraints](http://guides.rubyonrails.org/routing.html#advanced-constraints) allow us to define rules for restricting access to particular routes in your app.  A constraint class must simply implement a method called `matches?` that returns true if access is allowed and false otherwise.

Let's create a new constraint called `AuthenticatedConstraint` and use it to wrap our `GET /widgets` route.  Our constraint's `matches?` method will rely on the Warden strategy we'll implement next, which we'll call `TokenAuthenticationStrategy` to reflect the fact that it relies on an authentication token:

```ruby
# routes.rb

constraints AuthenticatedConstraint.new do
  resources :widgets, only: :index
end
```

```ruby
# app/constraints/authenticated_constraint.rb

class AuthenticatedConstraint
  def matches?(request)
    warden = request.env['warden']
    warden && warden.authenticate!(:token_authentication_strategy)
  end
end

Warden::Strategies.add(:token_authentication_strategy,
                       TokenAuthenticationStrategy)
```

What's going on here?  First, our constraint is grabbing the information that the Warden middleware inserts into the request's environment.  If that is present, it then uses Warden to call the `authenticate!` method that we'll define on our `TokenAuthenticationStrategy`.  This is a [convention of Warden strategies](https://github.com/hassox/warden/wiki/Strategies): they must implement an `authenticate!` method.

Then we're telling Warden about our strategy by calling `Warden::Strategies.add` (which we could really do anywhere, but here seems as good a place as any).  This stores our `TokenAuthenticationStrategy` in a hash of strategies that Warden keeps track of.

#### Step 3: Add our strategy

Now let's add our Warden strategy:

```ruby
# app/strategies/token_authentication_strategy.rb

class TokenAuthenticationStrategy < Warden::Strategies::Base
  def valid?
    env['HTTP_AUTHORIZATION'].present?
  end

  def authenticate!
    if user
      success!(user)
    else
      fail!(I18n.t('warden.messages.failure'))
    end
  end

  def store?
    false
  end

  def token
    env['HTTP_AUTHORIZATION'].sub('Token token=', '')
  end

  def user
    @user ||= User.
              where(authentication_token: token).
              where('authentication_token_expires_at > ?', Time.current).
              first
  end
end
```

Let's walk through this.  Our class inherits from `Warden::Strategies::Base`, which gives us a few things:
- A `success!` method that allows the request to proceed and sets the user in the request as `request.env['warden'].user`.
- A `fail!` method that halts the request and calls Warden's failure app. The failure app tells Warden what to do if a request fails.  If we're using Monban to authenticate users using email and password, as we are, it [sets up a default failure app for us](https://github.com/halogenandtoast/monban/blob/29b2070a7592b08019f131f838c4ddea869e35e1/lib/monban/warden_setup.rb#L40) that will [return a 401 response](https://github.com/halogenandtoast/monban/blob/29b2070a7592b08019f131f838c4ddea869e35e1/spec/monban/test_helpers_spec.rb#L7).  If not, you'll have to set this yourself in `application.rb`:

   ```ruby
   config.middleware.use Warden::Manager do |manager|
     manager.failure_app = lambda { |e| [ 401, {'Content-Type' => 'application/json'}, ['Authorization Failed'] ] }
   end
   ```

Before calling `authenticate!`, Warden will first call our `valid?` method. If it returns false, Warden won't attempt to authenticate.

Our `authenticate!` method pulls the token out of the request headers, looks for a user with that (unexpired) token, and calls Warden's `success!` or `fail!` methods depending on whether it finds such a user.

There's one other thing here that's very important for authenticating API requests (as opposed to web requests).  Warden's [`store?`](https://github.com/hassox/warden/blob/74162f2bf896b377472b6621ed1f6b40046525f4/lib/warden/strategies/base.rb#L101) method determines whether a user should remain logged in across requests. If not overridden, this method returns `true`, which will allow user a user to pass a valid auth token once and then remain authenticated across subsequent requests.  This is :no_good:.

Let's run our tests.  They should be passing!

#### Step 4: Extract a `User#for_authentication` method

We could leave as is and be done.  However, I usually extract the logic in `TokenAuthenticationStrategy#user` to a class method on the `User` model for easier testing. ([commit](https://github.com/IntrepidPursuits/api-authentication-demo/commit/712a125192aa22608900c1a5dba8beb4dbcea2de))

```ruby
# app/models/user.rb

class User < ActiveRecord::Base
  # ...

  def self.for_authentication(token)
    where(authentication_token: token).
      where('authentication_token_expires_at > ?', Time.current).
      first
  end
end
```

```ruby
# app/strategies/token_authentication_strategy.rb

class TokenAuthenticationStrategy < Warden::Strategies::Base
  # ...

  def user
    @user ||= User.for_authentication(token)
  end
end
```

See the demo app repo for the new method's tests.

### That's it!

Tune in next time for our third part in this series, in which we'll add a `POST /authentications` endpoint to regenerate authentication tokens when a user's token expires.
