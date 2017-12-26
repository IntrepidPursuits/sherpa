# OAuth and JWT
### What is it?

JSON Web Token, or JWT, is a mechanism for transmitting data between parties through a URL-safe token format. According to the [RFC7519](https://tools.ietf.org/html/rfc7519) standard, JWT is a string representation of a set of claims encoded in a JSON Web Signature structure. A JWT is a three-part string that is separated by dots. It looks something like this:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ`

Try decoding the above token with [JSON Web Tokens - jwt.io](https://jwt.io/). You will see the data payload once the signature is verified and decoded.

### Why do we need it?

JWT, combined with the authorization layer OAuth, allows clients and servers to exchange user information securely. With a JWT, clients may access protected routes, services and resources from the server.

### How do we use it with OAuth? 

To understand how to use JWT, we must understand where it fits in the OAuth authorization process:

1. A user provides user credentials to the OAuth service (Google, Facebook, Twitter, etc) via the client (mobile clients, browsers, and other devices)
2. OAuth service returns an access token back to the client
3. The client passes the access token to the server (app API) and the server verifies with the OAuth service that this access token is valid
4. If the access token is valid, the OAuth service returns the user’s information (username, id, etc.)
5. Finally, the server encodes the user information inside a JWT and passes the JWT back to the client
6. Once the client has the JWT, all future requests to the server (until the token expires) will require the Authorization header using the Bearer schema, like this:

`Authorization: Bearer <JWT>`

Here is a diagram of the authentication process with JWT:

![Diagram of JWT](https://cdn.auth0.com/content/jwt/jwt-diagram.png)


## Implementation (for Rails API Server):
1. Install gem  `jwt` [GitHub - jwt/ruby-jwt: A pure ruby implementation of the RFC 7519 OAuth JSON Web Token (JWT) standard.](https://github.com/jwt/ruby-jwt)
2. Encode the data payload using a secret, secret hash algorithm and with an expiration time claim (“exp”):
```
class EncodeJwt
...

  def perform
    JWT.encode payload, token_secret, 'HS256'
  end

  def payload
    { "data": 'user_data', "exp": expiration_time }
  end

  def expiration_time
    ENV["TOKEN_DURATION_DAYS"].to_i.day.from_now
  end

...
end
```

3. Decode the token and retrieve the data passed in the payload:
```
class DecodeJwt
...

  def perform
    JWT.decode token, token_secret, true, { :algorithm => 'HS256' }
  end

...
end
```
