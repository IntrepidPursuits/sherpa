# Ruby Code Style Guidelines.
#### Each bullet links to an example of both the incorrect and correct pattern(s) for that particlar rule.

## [General](#general)
* **[Prefer double quotes for strings](#prefer-double-quotes-for-strings)**
* **[Don't use spaces around square brackets](#dont-use-spaces-around-square-brackets)**
* **[Use spaces around curly braces](#use-spaces-around-curly-braces)**
* **[Use a trailing comma after the last item in a multi-line list](#use-a-trailing-comma-after-the-last-item-in-a-multi-line-list)**
* **[Avoid explicit return statements](#avoid-explicit-return-statements)**
* **[Avoid multiple assignments per line](#avoid-multiple-assignments-per-line)**
* **[Prefer && and || over AND and OR](#prefer--and--over-and-and-or)**
* **[Prefer ! over not](Prefer--over-not)**
* **[Use %{} for single-line strings needing interpolation and double-quotes](use--for-single-line-strings-needing-interpolation-and-double-quotes)**
* **[Avoid using semicolons](#avoid-using-semicolons)**
* **[Avoid organizational comments](#avoid-organizational-comments)**
* **[Use CamelCase for classes and modules, snake_case for variables, methods, and file names, SCREAMING_SNAKE_CASE for constants.](#use-camelcase-for-classes-and-modules-snake_case-for-variables-methods-and-file-names-screaming_snake_case-for-constants)**

## [Conditionals](#conditionals)
* **[Avoid lines that end with conditionals](#avoid-lines-that-end-with-conditionals)**
* **[Avoid ternary operators](#avoid-ternary-operators)**
* **[Prefer if over unless](#prefer-if-over-unless)**

## [Blocks](#blocks)
* **[Prefer &:method_name for simple method calls](#prefer-method_name-for-simple-method-calls)**
* **[Use {...} for single-line blocks. Use do..end for multi-line blocks](#use--for-single-line-blocks-use-doend-for-multi-line-blocks)**
* **[Prefer detect, select, map, and reduce for iteration](#prefer-detect-select-map-and-reduce-for-iteration)**

## [Classes & Methods](#classes--methods)
* **[Use ? suffix for predicate methods, and avoid prefixing auxiliary verbs](#use--suffix-for-predicate-methods-and-avoid-prefixing-auxiliary-verbs)**
* **[Use def with parentheses when there are arguments](#use-def-with-parentheses-when-there-are-arguments)**
* **[Don't use spaces after required keyword arguments](#dont-use-spaces-after-required-keyword-arguments)**
* **[Avoid bang method names](#avoid-bang-method-names)**
* **[Don't use self explicitly except for class methods and assignments](#dont-use-self-explicitly-except-for-class-methods-and-assignments)**
* **[Prefer shorthand class and module definitions](#prefer-shorthand-class-and-module-definitions)**
* **[Order class methods above instance methods](#order-class-methods-above-instance-methods)**

## General

### Prefer double quotes for strings.
  ```ruby
    # bad
      'Kaladin Stormblessed'

    # good
      "Kaladin Stormblessed"
  ```

### Use spaces around curly braces
  ```ruby
    # bad
    {name: "Kelsier", title: "Survivor of Hathsin"}

    # good
    { name: "Kelsier", title: "Survivor of Hathsin" }
  ```
### Don't use spaces around square brackets
  ```ruby
    # bad
    [ "Frodo, Gandalf, Aragorn, Legolas, Gimli, Sam, Merry, Pippin" ]

    # good
    ["Frodo, Gandalf, Aragorn, Legolas, Gimli, Sam, Merry, Pippin"]
  ```

### Use a trailing comma after the last item in a multi-line list.
  ```ruby
    # bad
    elephants = [
      "Dumbo",
      "Jumbo",
      "Bumbo",
      "Wumbo"
    ]

    # good
    elephants = [
      "Dumbo",
      "Jumbo",
      "Bumbo",
      "Wumbo",
    ]
  ```

### Avoid explicit return statements.
  ```ruby
    # bad
    def sum(operand_1, operand_2)
      return operand_1 + operand_2
    end

    # good
    def sum(operand_1, operand_2)
      operand_1 + operand_2
    end
  ```

### Avoid multiple assignments per line.
  ```ruby
    # bad
    def sum(operand_1, operand_2)
      x, y = operand_1, operand_2
      x + y
    end

    # good
    def sum(operand_1, operand_2)
      x = operand_1
      y = operand_2
      x + y
    end
  ```

### Prefer && and || over AND and OR.
  ```ruby
    # bad
    def valid_pizza?
      heavy_pizza? or (light_pizza? and big_pizza?)
    end

    # good
    def valid_pizza?
      heavy_pizza? || (light_pizza? && big_pizza?)
    end
  ```

### Prefer ! over not.
  ```ruby
    # bad
    def valid_pizza?
      not small_pizza?
    end

    # good
    def valid_pizza?
      !small_pizza?
    end
  ```

### Use %{} for single-line strings needing interpolation and double-quotes.
  ```ruby
    # bad
    def insert_annoying_thing_into_string
      thing = "annoying"
      'i am an "' + thing + '" string'
    end

    # good
    def insert_annoying_thing_into_string
      thing = "annoying"
      %{i am an "#{thing}" string}
    end
  ```

### Avoid using semicolons.
```ruby
  # bad
  def sum(operand_1, operand_2)
    operand_1 + operand_2;
  end

  # good
  def sum(operand_1, operand_2)
    operand_1 + operand_2
  end
```

### Avoid organizational comments.
  ```ruby
    # bad
    class Dog
      # associations
      belongs_to :user
      belongs_to :home
      has_many :favorite_foods

      # validations
      validates :name, presence: true
      validates :color, presence: true
      validates :breed, presence: true
    end

    # good
    class Dog
      belongs_to :user
      belongs_to :home
      has_many :favorite_foods

      validates :name, presence: true
      validates :color, presence: true
      validates :breed, presence: true
    end
  ```

### Use CamelCase for classes and modules, snake_case for variables, methods, and file names, SCREAMING_SNAKE_CASE for constants.
  ```ruby
    # bad
    # app/models/LoudCamelSnakes.rb
    class loudCamelSnakes
      maximum_camelsnake_capacity = 450

      def SneakyCamelSnake
      end
    end

    # good
    # app/models/loud_camel_snakes.rb
    class LoudCamelSnakes
      MAXIMUM_CAMELSNAKE_CAPACITY = 450

      def sneaky_camel_snake
      end
    end
  ```

# Conditionals

### Avoid lines that end with conditionals.
  ```ruby
    # bad
    def sum(operand_1, operand_2)
      operand_1 + operand_2 if valid_operands?
    end

    # good
    def sum(operand_1, operand_2)
      if valid_operands?
        operand_1 + operand_2
      end
    end
  ```

### Avoid ternary operators.
  ```ruby
    # bad
    def sum(operand_1, operand_2)
      valid_operands? ? operand_1 + operand_2 : raise InvalidOperandError
    end

    # good
    def sum(operand_1, operand_2)
      if valid_operands?
        operand_1 + operand_2
      else
        raise InvalidOperandError
      end
    end
  ```

### Prefer if over unless.
  - use `unless` for a single negation; use `if` otherwise.
  ```ruby
  # bad
    def best_pizza?
      if !small_pizza?
        true
      end
    end

  # also bad
    def best_pizza?
      unless !tasty_pizza || small_pizza?
        true
      end
    end

  # good
    def best_pizza?
      unless small_pizza?
        true
      end
    end

  # also good
    def best_pizza?
      if tasty_pizza && !small_pizza?
        true
      end
    end
  ```

# Blocks
### Prefer &:method_name for simple method calls.
  ```ruby
    # bad
    def delicious_pizza?
      toppings.detect{ |topping| topping.delicious }
    end

    # good
    def delicious_pizza?
      toppings.detect(&:delicious)
    end
  ```

### Use {...} for single-line blocks. Use do..end for multi-line blocks.
  ```ruby
    # bad
      def choose_best_vacations(places)
        places.select { |place|
          if place.super_fun?
            place
          end
        }
      end

    # also bad
    def choose_best_vacations(places)
      places.select do |place| place if place.super_fun? end
    end

    # good
    def choose_best_vacations(places)
      places.select do |place|
        if place.super_fun?
          place
        end
      end
    end

    # also good
    def choose_best_vacations(places)
      places.select { |place| place if place.super_fun? }
    end
  ```

### Prefer detect, select, map, and reduce for iteration.
  ```ruby
    # bad
    def find_elephants(animals)
      elephants = []
      animals.each do |animal|
        if animal.elephant
          elephants << animal
        end
      end
    end

    # good
    def find_elephants(animals)
      animals.select do |animal|
        if animal.elephant?
          animal
      end
    end
  ```

# Classes & Methods
### Use ? suffix for predicate methods, and avoid prefixing auxiliary verbs.
  ```ruby
    # bad
    def is_big
      dinosaur.size == "big"
    end

    # also bad
    def is_big?
      dinosaur.size == "big"
    end

    # good
    def big?
      dinosaur.size == "big"
    end
  ```

### Use def with parentheses when there are arguments.
  ```ruby
    # bad
    def find_elephants animals
      animals.select do |animal|
        if animal.elephant?
          animal
      end
    end

    # good
    def find_elephants(animals)
      animals.select do |animal|
        if animal.elephant?
          animal
      end
    end
  ```

### Don't use spaces after required keyword arguments.
  ```ruby
    # bad
    def sum(operand_1: , operand_2: , operand_3:)
      operand_1 + operand_2 + operand_3
    end

    # good
    def sum(operand_1:, operand_2:, operand_3:)
      operand_1 + operand_2 + operand_3
    end
  ```

### Avoid bang method names
  - Bang (!) usually denotes a "dangerous" method, meaning that it will modify the object it's called on.
  ```ruby
    # bad
    class Bus
      def number_of_wheels!(bus_params)
        self.number_of_wheels = bus_params[:number_of_wheels]
        self.save
      end
    end

    # good
    class Bus
      def update_number_of_wheels(bus_params)
        self.number_of_wheels = bus_params[:number_of_wheels]
        self.save
      end
    end
  ```

### Don't use self explicitly except for class methods and assignments.
  ```ruby
    # bad
    class Bus
      def pounds_per_meter
        self.weight / self.height
      end
    end

    # good
    class Bus
      def pounds_per_meter
        weight / height
      end
    end

    # also good
    class Bus
      def self.heavy_buses
        Bus.where(weight: 50000)
      end
    end
  ```

### Prefer shorthand class and module definitions.
  ```ruby
    # bad
    class Automobile
      class Bus
        def pounds_per_meter
          weight / height
        end
      end
    end

    # good
    class Bus::Automobile
      def pounds_per_meter
        weight / height
      end
    end
  ```

### Order class methods above instance methods.
  ```ruby
    # bad
    Class Rollercoaster
      def rider_capacity
        number_of_cars * seats_per_car
      end

      def self.perfect_rollercoasters
        Rollercoaster.where(score: 10)
      end

      def seats_per_car
        car.number_of_seats
      end
    end

    # good
    Class Rollercoaster
      def self.perfect_rollercoasters
        Rollercoaster.where(score: 10)
      end

      def seats_per_car
        car.number_of_seats
      end

      def rider_capacity
        number_of_cars * seats_per_car
      end
    end
  ```
