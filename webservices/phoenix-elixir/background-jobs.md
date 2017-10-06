### Background Jobs

Phoenix lets us use [GenServers](https://elixir-lang.org/getting-started/mix-otp/genserver.html) for background jobs.
A really simple example of a GenServer background job would be putting "Hello,
the current unix timestamp is <current unix timestamp>" to the console at
regular intervals. This is a simple example for purposes of this document. We
can, of course, use background jobs to do an assortment of things:

- Make an external API request every 5 minutes
- Clean out unregistered users every 48 hours
- Do some kind of batch processing once a day

And so forth. An advantage here is that the processing can happen internally. We
do not need external resources or software to run these processes, and, per the
Erlang ethos, as these processes fail, they can restart as needed.

Our application server, first off, needs to be aware that it will be running a
periodic job, so we can add a line of code that indicates that in the `start()`
function of `lib/phoenix_example_app/application.ex` file:

```
worker(PhoenixExampleAppWeb.Worker.CurrentUnixTime, [])
```

If we try starting our app now (`iex -S mix phx.server`) we will see errors of
the following:

```
=INFO REPORT==== 6-Oct-2017::12:09:20 === application: logger exited: stopped
type: temporary ** (Mix) Could not start application phoenix_example_app:
  PhoenixExampleApp.Application.start(:normal, []) returned an error: shutdown:
  failed to start child: PhoenixExampleAppWeb.Worker.CurrentUnixTime ** (EXIT) an
  exception was raised: ** (UndefinedFunctionError) function
  PhoenixExampleAppWeb.Worker.CurrentUnixTime.start_link/0 is undefined (module
  PhoenixExampleAppWeb.Worker.CurrentUnixTime is not available)
  PhoenixExampleAppWeb.Worker.CurrentUnixTime.start_link() (stdlib)
  supervisor.erl:365: :supervisor.do_start_child/2 (stdlib) supervisor.erl:348:
  :supervisor.start_children/3 (stdlib) supervisor.erl:314:
  :supervisor.init_children/2 (stdlib) gen_server.erl:365: :gen_server.init_it/2
  (stdlib) gen_server.erl:333: :gen_server.init_it/6 (stdlib) proc_lib.erl:247:
  :proc_lib.init_p_do_apply/3
```

This is simply saying we need an actual worker in our app (since the `start()`
function cannot find it). We will add this worker to
`lib/phoenix_example_app_web/workers` as `current_unix_time.ex` which has a
module named `PhoenixExampleAppWeb.Worker.CurrentUnixTime`:

```
defmodule PhoenixExampleAppWeb.Worker.CurrentUnixTime do
  @moduledoc """
  This prints out the current UNIX timestamp once an hour.
  """

  use GenServer

  @interval 3_600_000

  def start_link(opts \\ [name: __MODULE__]) do
    GenServer.start_link(__MODULE__, nil, opts)
  end

  def init(state) do
    schedule_work(@interval)

    {:ok, state}
  end

  def handle_info(:work, state) do
    unix_time =
      DateTime.utc_now
      |> DateTime.to_unix

    IO.puts(unix_time)

    schedule_work(@interval)
    {:noreply, state}
  end

  defp schedule_work(interval) do
    Process.send_after(self(), :work, interval)
  end
end
```

`handle_info/2` houses the primary requirements for the job and
`schedule_work/1` handles the dissemination of the job per the interval set as
a module attribute in the GenServer.

Now if we run `iex -S mix phx.server`, we will see the UNIX timestamp print out
at the interval that has been set:

```
--- intrepid/phoenix_example_app ‹master* M› » iex -S mix phx.server
1 ↵
Erlang/OTP 20 [erts-9.1] [source] [64-bit] [smp:4:4] [ds:4:4:10]
[async-threads:10] [hipe] [kernel-poll:false]

Compiling 1 file (.ex)
[info] Running PhoenixExampleAppWeb.Endpoint with Cowboy using
http://0.0.0.0:4000
Interactive Elixir (1.5.1) - press Ctrl+C to exit (type h() ENTER for help)
iex(1)> Hello, the current unix timestamp is 1507308797
```

This same design pattern can be followed for various kinds of background jobs suggested above.

Reference commit here:
https://github.com/IntrepidPursuits/phoenix-example-app/commit/a00fd346edfb26687d389d11b56437e05c50dd5b
