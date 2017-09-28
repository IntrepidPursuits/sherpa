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

[Credo](https://github.com/rrrene/credo)
> Credo is a static code analysis tool for the Elixir language with a focus on teaching and code consistency

Reference commit: https://github.com/IntrepidPursuits/phoenix-example-app/commit/3c8a8637ae2336012384255781d1c95b4e2fe452

- We can run `mix credo --strict` to get a list of areas we can fix. Running
  that on the example app returns the following:

![credo](https://imgur.com/a/hqtok)

In this commit, we fix the Credo warnings:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/3f6928ef9ecb0959f9917a658b48ea35e7a06a10

Running `mix credo --strict` now shows that we are good to go:

```
--- intrepid/phoenix_example_app ‹master* M› » mix credo --strict
Checking 13 source files ...

Please report incorrect results: https://github.com/rrrene/credo/issues

Analysis took 0.1 seconds (0.02s to load, 0.1s running checks)
30 mods/funs, found no issues.
```

### Add Dialyxir (Typespecs + static analysis)

Dialyzer (DIscrepancy AnalYZer for ERlang) is a static analysis tool, which can
provide type mismatches and other errors. Dialyxir is a compilation of mix tasks
to use Dialyzer in an Elixir project:

https://github.com/jeremyjh/dialyxir

Here, we install `dialyxir` in the project:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/7061e5ff6f9f6046eba676eba89c3b1682b781c4

We can run `mix dialyzer` now. The first time we run this, it will take a while
because the task needs to build PLTs (Persistent Lookup Tables), which house the 
cached static analyses. Running `mix dialyzer` at this point will return
something like the following:

```
--- intrepid/phoenix_example_app ‹master* M› » mix dialyzer
Checking PLT...
[:asn1, :bunt, :compiler, :connection, :cowboy, :cowlib, :credo, :crypto,
:db_connection, :decimal, :dialyxir, :ecto, :eex, :elixir, :file_system,
:gettext, :kernel, :logger, :mime, :phoenix, :phoenix_ecto, :phoenix_html,
:phoenix_live_reload, :phoenix_pubsub, :plug, :poison, :poolboy, :postgrex,
:public_key, :ranch, :runtime_tools, :ssl, :stdlib]
PLT is up to date!
Starting Dialyzer
dialyzer args: [check_plt: false,
 init_plt: '/Users/vikram7/Desktop/ql/intrepid/phoenix_example_app/_build/dev/dialyxir_erlang-20.1_elixir-1.5.1_deps-dev.plt',
 files_rec: ['/Users/vikram7/Desktop/ql/intrepid/phoenix_example_app/_build/dev/lib/phoenix_example_app/ebin'],
 warnings: [:unknown]]
done in 0m2.77s
done (passed successfully)
```

Here is an example of how we would use Dialyzer to check typespecs in our app.
The compiler ignores typespecs, so we can use Dialyzer to perform type checking.
We will add an incorrect typespec to our `lib/phoenix_example_web_app/views/error_helpers.ex`
file and see the error that dialyzer provides:

```
@spec error_tag(atom, atom) :: String
def error_tag(form, field) do
  Enum.map(Keyword.get_values(form.errors, field), fn (error) ->
    content_tag :span, translate_error(error), class: "help-block"
  end)
end
```

When we run `mix dialyzer`, we see the following:

```
done in 0m3.57s
lib/phoenix_example_app_web/views/error_helpers.ex:11: Invalid type specification for function
'Elixir.PhoenixExampleAppWeb.ErrorHelpers':error_tag/2. The success typing is
(atom() | #{'errors':=[{_,_}], _=>_},atom()) -> [any()]
```

This tells us that our `String` type is incorrect. It should be `iodata` because
the function is returning an `Enum.map`. After we fix this, dialyzer runs
without any errors:

https://github.com/IntrepidPursuits/phoenix-example-app/commit/06eca41448dcec4539e8b897fa2eba87276ef22f

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

