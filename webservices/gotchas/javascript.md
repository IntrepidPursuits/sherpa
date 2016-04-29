## Gotchas with common javascript functions

###PUT, PATCH and DELETE ajax requests 

####Requests that manipulate data need CSRF tokens

CSRF stands for `Cross Site Request Forgery`. Effectively what a CSRF requirement is attempting to prevent is the ability for another site to trick a user into clicking a link that may cause malicious behavior such as deleting your account, or transfer money somewhere.

A detailed account can be found [here].
[here]: http://stackoverflow.com/questions/941594/understanding-the-rails-authenticity-token

This is a sample implementation of a submission through and AJAX call. Using the Rails built in forms or [simple form for] will do this automatically. However sometimes this is not ideal if the elements you are selecting are loaded via another AJAX call.

[simple form for]: https://github.com/plataformatec/simple_form

**Form to Delete**
Create a Rails button and use this special `token_tag` generator to create a CSRF token on the page.
```
<h3>Delete endorsement for <%= user.name %></h3>
<p class="modal-content">Are you sure you wish to delete this endorsement? This action cannot be undone. </p>
<%= token_tag nil %>
<%= submit_tag 'Confirm Delete', type: 'button', class: "delete-button" %>
```

**Javascript to Send AJAX Call**
grab the id's you need from elements on the page in order to build your url. Then add then token as an `authenticity_token` in the `data` portion of the AJAX call.

```
$(document).ready(function () {
  $(document).on("click", ".delete-button", function(e){
    $user_id = $(".user-detail-tile").attr("id");
    $endorsement_id = $(this).attr("id");

    var token = $("input[name='authenticity_token']").val()

    $.ajax({
      type: "DELETE",
      data: { authenticity_token: token },
      url: "/admin/users/" + $user_id + "/endorsements/" + $endorsement_id
    }).success(function (data) {
      if(!data.error) {
        location.reload(true);
      }
    });
    e.preventDefault();
  });
});
```

**Controller Action**
This is a pretty standard Rails `DELETE` API endpoint that returns a success boolean to let the AJAX callback know that the operation succeeded.
```
def destroy
  @endorsement = Endorsement.find(params[:id])

  @endorsement.destroy

  render json: { "success": true }
end
```


**Correct Rails Server Logs**
```
Started DELETE "/admin/authentications/9c4c929a-15a1-4060-a916-bcf2d2e81634" for ::1 at 2016-04-26 16:29:13 -0400
Processing by Admin::AuthenticationsController#destroy as HTML
  Parameters: {"authenticity_token"=>"YkAEMRuYbnoa7WAJNB67SvL9679qiB9TTkm6vP8EHgcOS5UKyEgHueu3Onn3fylSOP849ivMaOgbNk8tU1HzDw==", "id"=>"9c4c929a-15a1-4060-a916-bcf2d2e81634"}
```

###Signs Something is Wrong

In Intrepid's standard Warden setup you might see the browser getting redirected
```
Started DELETE "/admin/users/9c4c929a-15a1-4060-a916-bcf2d2e81634/endorsements/ed16dfa9-1dc1-4bb8-9778-ca97e0349709" for ::1 at 2016-04-26 15:17:41 -0400
Processing by Admin::EndorsementsController#destroy as */*
  Parameters: {"user_id"=>"9c4c929a-15a1-4060-a916-bcf2d2e81634", "id"=>"ed16dfa9-1dc1-4bb8-9778-ca97e0349709"}
Can't verify CSRF token authenticity
Geokit is using the domain: localhost
Redirected to http://localhost:3000/admin/authentications/new
Filter chain halted as :authorize_admin rendered or redirected
Completed 302 Found in 1ms (ActiveRecord: 0.0ms)


Started DELETE "/admin/authentications/new" for ::1 at 2016-04-26 15:17:41 -0400
Processing by Admin::AuthenticationsController#destroy as */*
  Parameters: {"id"=>"new"}
Can't verify CSRF token authenticity
Geokit is using the domain: localhost
Redirected to http://localhost:3000/admin/authentications/new
Filter chain halted as :authorize_admin rendered or redirected
Completed 302 Found in 1ms (ActiveRecord: 0.0ms)
```

This action is the culprit. `current_user` is `nil` and triggering a redirect.
```
class Admin::BaseController < ApplicationController
  before_action :authorize_admin

  private

  def authorize_admin
    unless current_user
      redirect_to new_admin_authentication_path
    end
  end
end
```

The attribute `current_user` is the user that the server associates with the request's authenticity token.
```
def current_user
  request.env['warden'].user
end
```
