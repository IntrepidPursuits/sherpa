## Miscellaneous best practices

* Use destroy dependencies on `has_many` associations

```ruby
class BlogPost < ActiveRecord::Base
  has_many :comments, dependent: :destroy
end
```

* Add indexes for all attributes that you may query on when creating a table or adding a column

```ruby
def change
  add_column :blog_posts, :category_name, :string
  add_index :blog_posts, :category_name
end
```
