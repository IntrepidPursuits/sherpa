## Gotchas with commonly used gems

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
