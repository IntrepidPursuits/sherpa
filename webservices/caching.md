## Best Practice on Caching

`GET` requests that return a resource or set of resources should enable caching via `If-Modified-Since` and `Last-Modified` headers.

* The client can send an `If-Modified-Since` header.  If the resource(s) has not been modified since that time, a 304 response should be returned with no request body.
* These endpoints should always include a `Last-Modified` header that includes the most recent time the resource(s) were modified.
  - In the case of a `GET` request that returns a set of resources, this should be the `updated_at` timestamp of the most recently updated resource.

### Example implementations

Call the `stale?` method in your controller action, passing it the relevant resource.  From the [documentation](http://apidock.com/rails/ActionController/ConditionalGet/stale%3F):

> Sets the etag and/or last_modified on the response and checks it against the client request. If the request doesn’t match the options provided, the request is considered stale and should be generated from scratch. Otherwise, it’s fresh and we don’t need to generate anything and a reply of 304 Not Modified is sent.

#### Single resource

```ruby
def show
  blog_post = BlogPost.find(params[:id])

  if stale?(blog_post)
    render json: blog_post
  end
end
```

#### Set of resources

```ruby
def index
  blog_posts = BlogPost.order(updated_at: :desc)

  if stale?(blog_posts.first)
    render json: blog_posts
  end
end
```

### Other considerations

#### Child resources

Consider an endpoint `GET /blog_posts` that returns a list of blog posts and their comments.  The client sends an `If-Modified-Since` header of 5 minutes ago.  No blog posts have been modified in the last 5 minutes, but a comment has been added to one of them.

In most such cases, we'll treat this set of resources as though it has been modified, although the parent resources have not been.

The easiest way to ensure this treatment is to modify the parent record's `updated_at` timestamp when a child resource is added or updated using `touch: true`:

```ruby
class Comment < ActiveRecord::Base
  belongs_to :blog_post, touch: true
end

class BlogPost < ActiveRecord::Base
  has_many :comments
end
```
