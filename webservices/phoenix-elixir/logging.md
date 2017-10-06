# Logging

[Papertrail](https://papertrailapp.com/) is a great tool to tail logs easily. It
offers a free tier along with paid tiers, which allow historical log inspection.
This covers how to set up Logging and Papertrail quickly in a Phoenix app.

First, we install [logger_papertrail_backend](https://github.com/larskrantz/logger_papertrail_backend) as a dependency by adding it to our mix file
and update our config:

reference commit:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/bd831c16d59bb47fd925e4738b666fc4556f95d7

Now we need to `require Logger` in the modules we want to have Logger
statements. We go back to our Genserver example here:

reference commit:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/f0c6b195ce6f941266fbde983dd124c933db7fe7

Everytime `handle_info/2` is called, Logger will capture the statement we want
to log. `Logger` also supports other [levels](https://hexdocs.pm/logger/Logger.html). 
Being generous with our Loggers across our apps will help us debug later on.
