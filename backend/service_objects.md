# Intro to Service Objects:
The Model View Controller (MVC) architecture that Rails provides is quite useful for organizing and separating code by functionality, and service objects are another step down the path of the “place for everything and everything in its place” mentality.

If models are supposed to contain its own behaviors and controllers are meant to route incoming requests and views take and display data, then where do you put the other “stuff”? Often the answer is service objects. In particular, service objects are useful when a particular “job” involves multiple models, several steps, calls to outside APIs, or otherwise doesn’t fit neatly into any of the other MVC buckets.

Say we are building a backend to facilitate signing up board game players. Among other things, our API will need to confirm that a player has signed up for a game. At the very least, this would involve both the `Player` and `Game` models. And while we could put all of this “business logic” into the controller that responds to this request, this could quickly pollute our controllers.

Instead, we might create a service object that will bundle all the tasks related to this behavior. The controller will be responsible for calling the service object, and the service object will be responsible for executing the job. This way, our controllers are simply receiving traffic and signaling that certain jobs are needed; and, our service objects will be self-contained, of a singular purpose, and reusable - all good things.

Let’s assume we have User, Player, and Game models, where:
	* a User has many Players
	* a Player has one User
	* a Player has one Game
	* Games have many Players

Here is how a service object that confirms a player is playing in a game might look:
/(below we’ll break down the individual components)/

```
class PlayerConfirmer

  def initialize(game_id:, players_user_ids:)
    @game_id = game_id
    @players_user_ids = players_user_ids
  end

  def self.perform(game_id:, players_user_ids:)
    new(game_id: game_id, players_user_ids: players_user_ids).perform
  end

  def perform
    confirm_interested_players
  end

  private
  attr_reader :game_id, :players_user_ids

  def interested_players
    @interested_players ||= Player.includes(:game, :user)
                               .where(user_id: players_user_ids,
                                      game_id: game_id,
                                      status: 'interested')
  end

  def confirm_interested_players
    interested_players.each do |player|
      player.update!(status: 'confirmed')
    end
  end
end
```

While service objects can be used for a wide variety of purposes, often they  are structured in a particular way. Service object names, for example, usually have an action associated with them. In our case, we have `PlayerConfirmer`, which describes the job this service object performs.

```
class PlayerConfirmer
  def initialize(game_id:, players_user_ids:)
    @game_id = game_id
    @players_user_ids = players_user_ids
  end

	...

	private
	attr_reader :game_id, :players_user_ids

```

We begin by defining a `PlayerConfirmer` class, initializing it with `game_id` and `player_user_ids` attributes, and setting private attribute readers for them.  Often, it’s a good idea to pass in named arguments. this prevents needing to extract individual attributes from an amorphous `params`  argument, allows for arguments to be supplied in any order, and makes your code more readable.

```
 def self.perform(game_id:, players_user_ids:)
    new(game_id: game_id, players_user_ids: players_user_ids).perform
    return game
  end
```

The next section of code may look a little strange, but it is a hallmark of service objects. In a sense, by defining a `perform` class method, we are creating a “wrapper” method in order to instantiate a new `PlayerConfirmer` class and call its `perform`  method. While this may seem unnecessary at first, the benefit comes when calling the service object. With this convention, we are able to write `PlayerConfirmer.perform(game_id: 123, player_user_ids: [21, 22])`, which is much cleaner than the alternative.

```
...

	def perform
    confirm_interested_players
  end

  private
	attr_reader :game_id, :players_user_ids

  def interested_players
    @interested_players ||= Player.where(
							  user_id: players_user_ids,
                           game_id: game_id,
                           status: 'interested')
  end

  def confirm_interested_players
    interested_players.each do |player|
      player.update!(status: 'confirmed')
    end
  end
```

Another best practice is to expose only those methods that will need to be called on the object externally; all other methods should be `private`. In this case, the only `public` methods are `self.perform` and `perform` , which are used to call `PlayerConfirmer`. Then, the `perform` instance method will be responsible for using the internal, `private` methods.

In the case above, `.perform`  calls `.confirm_interested_players` , which calls `.interested_players`, which uses `game_id` and `players_user_ids` to find the right players.

While this example is certainly contrived, we can take away a few common patterns:

1. *Naming conventions:* Use an action to signify the service object’s purpose

2. *Minimum adequate exposure:* Make methods and attribute readers private unless needed externally

3. *General structure:*
```
class ObjectMaker

  def initialize(...)
	  ...
  end

  def self.perform(...)
    new(...).perform
  end

  def perform
    some_method
  end

  private

	def some_method
	  ...
	end

end
```

4. *Instantiating and calling:* ObjectMaker.perform(first_arg: first_arg, second_arg: second_arg)

*More reading on service objects:*
  * [Service Objects in Rails by Edward Loveall](https://blog.edwardloveall.com/service-objects-in-rails)
  * [Service Objects in Ruby on Rails…and you – Hacker Noon](https://hackernoon.com/service-objects-in-ruby-on-rails-and-you-79ca8a1c946e)
  * [Using Services to Keep Your Rails Controllers Clean and DRY](http://www.engineyard.com/blog/keeping-your-rails-controllers-dry-with-services)
