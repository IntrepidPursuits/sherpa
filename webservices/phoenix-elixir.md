# Phoenix / Elixir Documentation of Best Practices

## Outline

The Phoenix [docs](https://hexdocs.pm/phoenix/Phoenix.html) are a phenomenal
place to refer to for more details on Phoenix apps.

As of this writing, versions of Elixir, Phoenix and Erlang below: 

Elixir: 1.5.1
Phoenix 1.3.0
Erlang: 20.1

### Styleguide
- http://elixir.community/styleguide

### Using asdf

`asdf` (link) is a version manager for different languages. It is a great
version manager to work with.

- what is `.tool-versions`

- this is what `.tool-versions` looks like for this:

```
elixir 1.5.1
erlang 20.1
```

This file sits in the home directory:

`/Users/vikram7/.tool-versions`

We can also use a `.tool-versions` file in the root of the app to specify which
versions of Elixir and Erlang to use for that particular app.

### Creating an app

We can get the latest version of Phoenix here:

```
mix archive.install https://github.com/phoenixframework/archives/raw/master/phx_new.ez
```

- How to create an app

Refererence: https://hexdocs.pm/phoenix/up_and_running.html

`mix phx.new phoenix_example_app --no-brunch`

We use the `--no-brunch` option to not use Brunch.io for asset management since
we will not be using an asset pipeline.

This generates the base Phoenix app.

References commit here: https://github.com/IntrepidPursuits/phoenix-example-app/commit/b0da4648d18ed00f6699483686bb350ad402480a

#### Couple areas to highlight here

##### Config

Configuration in Phoenix apps relies on maintaining state of config as a keyword
list. Similarly, non-application configs are stored as keyword lists as well.
For example, database related configuration for the development environment is
configured here:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/b0da4648d18ed00f6699483686bb350ad402480a#diff-de9210b77e43a621a256d7a37fc5f50aR1

For more reading on this, please see the Phoenix docs on [Mix.Config](https://hexdocs.pm/mix/Mix.Config.html)

We can retrieve all the config using `Application.get_all_env(:phoenix_example_app)` when in console mode.

##### Router
The application router sits at `lib/phoenix_example_app_web/router.ex`:

https://github.com/IntrepidPursuits/phoenix-example-app/commit/b0da4648d18ed00f6699483686bb350ad402480a#diff-2538848882aa7f14e75b5ab29f6b4e7bR1

We will add endpoints here. We can run `mix phx.routes` to see the routes we
have available.

### Add Credo (Linter config)

- Reference commit
- Explain what Credo is
- What it does, some examples
- Running `mix credo --strict`

### Add Dialyxir (Typespecs + static analysis)

- Reference commit
- Explain what Dialyxir is
- What it does, some examples
- require typespecs
-- What are Typespecs
-- How are they used
-- Some examples
- Dialyzer

```
Dialyzer is a static analysis tool for Erlang and other languages that compile
to BEAM bytecode for the Erlang VM. It can analyze the BEAM files and provide
warnings about problems in your code including type mismatches and other issues
that are commonly detected by static language compilers. The analysis can be
improved by inclusion of type hints (called specs) but it can be useful even
without those. For more information I highly recommend the Success Typings paper
that describes the theory behind the tool.
```

### Testing

- Reference commit
- Couple testing examples
- Using fixtures / test helpers / ex machina

### Circle CI

- Give example config

### Install inch_ex for documentation coverage

- Reference commit
- Why we do this
- Examples

