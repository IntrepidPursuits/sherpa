# Phoenix / Elixir Documentation of Best Practices

## Outline

### Styleguide
- http://elixir.community/styleguide

### Creating an app

- Reference initial commit
- How to create an app
- Using asdf and `tool-versions`
- As of this writing, elixir version, phoenix version and erlang version
- Highlight any areas worth highlighting in commit

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

### Install inch_ex for documentation coverage

- Reference commit
- Why we do this
- Examples

