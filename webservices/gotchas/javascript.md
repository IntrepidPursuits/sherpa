## Gotchas with common javascript functions

###PUT, PATCH and DELETE ajax requests 

####Requests that manipulate data need CSRF tokens

CSRF stands for `Cross Site Request Forgery`. Effectively what this requirement is attempting to prevent is the ability for another site to trick a user into clicking a link that may cause you delete your account, or transfer money somewhere if they know your services API well.

A detailed account can be found [here].
[here]: http://stackoverflow.com/questions/941594/understanding-the-rails-authenticity-token

**Form to Delete**
```
<h3>Delete endorsement for <%= user.name %></h3>
<p class="modal-content">Are you sure you wish to delete this endorsement? This action cannot be undone. </p>
<%= token_tag nil %>
<%= submit_tag 'Confirm Delete', type: 'button', class: "delete-button" %>
```

**Javascript to Send AJAX Call**

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

The attribute `current_user` is defined byt the browsers ability to find the user from the requests authenticity token
```
def current_user
  request.env['warden'].user
end
```
