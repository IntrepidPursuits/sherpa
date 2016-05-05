## Gotchas with Rails

### I made a change to config or an initializer and it's not reflected in my dev environment! :sob:

The culprit may be [spring](https://github.com/rails/spring), Rails' application preloader. Sometimes it's bad at its job. Run `spring stop` and see if that fixes the problem.
