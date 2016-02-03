## Gotchas with commonly used gems

###Acts-as-taggable-on or Acts-as-follower

####Using Taggables with UUIDs

When using the acts-as-taggable-on gem it will generate migrations for the taggable tables with the command

```
rake acts_as_taggable_on_engine:install:migrations
```

If the database is set up using UUIDs as opposed to integer IDs then edit the migration whose title looks like

```
..._acts_as_taggable_on_migration.acts_as_taggable_on_engine.rb
```
and change this line

```
t.references :taggable, polymorphic: true
```

to

```
t.references :taggable, polymorphic: true, type: :uuid
```

### Monban

#### Case-insensitive lookup

We use Monban for email (or username) and password authentication. By default, Monban does not treat email (or username, or other lookup fields) as case-insensitive.  Thus, a user with email geneparmesan@example.com will not be able to log in if enters GeneParmesan@example.com.  This will not stand. The fix is this:

```ruby
config/initializers/monban.rb

Monban.configure do |config|
  # sub in email for username or other lookup field as necessary
  config.find_method = ->(params) { Monban.config.user_class.find_by(email: params[:email].downcase) }
end
```

Note also that your validation for `email` should be case-insensitive:

```ruby
validates :email, uniqueness: { case_sensitive: false }
```
(Benn: note, by changing our configuration this way, we are exposing ourselves to an edge case where some email server might actually use case-sensitive email addresses. Technically, according to RFC 2821, email addresses are supposed to be case sensitive. That said, this is extremely unlikely, as any reasonable email system would block two addresses that differ only by case)

### Shoulda

#### Uniqueness validations

When testing uniqueness validations, if you also have a uniqueness constraint on the database, and not just on the model, you need to create a record before running the test or you'll get an error.

```ruby
# spec/models/widget_spec.rb

it do
  create(:widget)
  should validate_uniqueness_of(:name)
end
```

If you omit `create(:widget)`, you'll get an error like the following:

```
1) Widget validations should require case sensitive unique value for name
     Failure/Error: should validate_uniqueness_of(:name)
     ActiveRecord::StatementInvalid:
       PG::NotNullViolation: ERROR:  null value in column "some_other_required_column" violates not-null constraint
       DETAIL:  Failing row contains (02fe5585-93d6-44fb-a79d-3ea4e1f806bf, 2016-01-12 13:30:23.569997, 2016-01-12 13:30:23.569997, a, null, null).
       : INSERT INTO "widgets" ("name", "created_at", "updated_at") VALUES ($1, $2, $3) RETURNING "id"
```

#### Inclusion validation

If you have an inclusion validation like so:

```ruby
# spec/models/widget_spec.rb

it { should validate_inclusion_of(:name).in_array(['Widgetron', 'Widgetron Deluxe']) }
```

be aware that it may fail if: (a) you have a uniqueness constraint on `name` and (b) have already created a record with that name in your database, for example in a `before :each` or `let` block:

```ruby
let!(:widet) { create(:widget) }

it { should validate_uniqueness_of(:name) }
# will fail with an error suggesting the array in the test does not match the
# array you're using to validate in the model, which is false and misleading.
it { should validate_inclusion_of(:name).in_array(['Widgetron', 'Widgetron Deluxe']) }
```
