Fooll is a fullstack modular framework for nodejs.

# Installation
```
npm i --save fooll
```

# Usage

This is the simplest server setup:
```javascript
const Fooll = require('fooll');

var server = new Fooll();
server.listen();
// it will listen on port 3000
```

Fooll will now look for app modules. By default, it will search for them in `app_modules` folder.

Every folder in `app_modules` is considered as a module named as the folder name.

Ex:
```
app_modules
  |__ auth
```
Here you get a module:
```javascript
server.modules.auth
```

## Module's Structure
This is how a basic module looks like:
```
module
  |__ client
  |__ views
  |__ index.js
```

### index.js

```javascript
const Foola = require('foola');

class ModuleName extends Foola {

  GET_root(req, res) {
    res.end('You are in module home page');
  }

}

module.exports = ModuleName;
```
This the simplest `index.js` of a module. Let's explain it:

#### Inheritance
```javascript
const Foola = require('foola');

class ModuleName extends Foola 
```
Here we extended our module to `Foola` class. The `Foola` class is the top most class.

Of course, you can extend your class to some other class but keep in mind that `Foola` should be the top most one.

Ex:
```javascript
class SocialAuth extends Auth
``` 
And
```javascript
class Auth extends Foola
```

#### Routing
Using `Fooll` framework, you don't need routes configuration. However it follows a convention that makes it easy to know what action is done for any given route.

The convention is:
```
/moduleName/action/params[0]/params[1]/params[2]/...
```

Ex:

*(This is for example purpose, but never put passwords in route)*

`POST` to:
```
/auth/login/omar/123456
```
And to handle this request add this method to `app_modules/auth/index.js`:
```javascript
POST_login(req, res) {
  req.params[0] // omar
  req.params[1] // 123456
}
```
##### Root
Imagine now you want to `GET` a modules root, you'll request this:
```
/auth/
```
And to handle this add this method to `app_modules/auth/index.js`:
```javascript
GET_root(req, res) {
  res.end("This is the auth's root")
}
```
You can, even use `POST_root`, `PUT_root`...

### Views
`Foola` uses [pug-layout](https://www.npmjs.com/package/pug-layout) to handle its views.

Module's views are stored in views folder.

Then you'll find the views in `views` object in module class.

Ex:

```javascript
app_modules
  |__ auth
        |__ views
              |__ main.pug
        |__ index.js
```

**main.pug**
```pug
h1
  Auth module root
```

**index.js**
```javascript
const Foola = require('foola');

class Auth extends Foola {

  GET_root(req, res) {
    var html = this.views.main.render();
    res.end(html);
  }

}

module.exports = Auth;
```

Views are by default read as Pages *(view pug-layout docs)*, If you want them to be considered layouts, just start the view file name with `L_`.

Ex:

```javascript
app_modules
  |__ auth
        |__ views
              |__ main.pug
              |__ L_layout.pug
        |__ index.js
```

**L_layout.pug**
```pug
html
  body
    header
      My Awesome Website
    block content
```

**main.pug**
```pug
block content
  h1
    Auth module root
```

**index.js**
```javascript
const Foola = require('foola');

class Auth extends Foola {

  GET_root(req, res) {
    var layout = this.views.L_layout;
    this.views.main.extends(layout);
    var html = this.views.main.render();
    res.end(html);
  }

}

module.exports = Auth;
```

### Client
`client` folder contains all the public files of your module, They are accessed from `file` action.

Ex:
```javascript
app_modules
  |__ auth
        |__ client
              |__ img
                    |__ logo.png
        |__ views
              |__ main.pug
        |__ index.js
```

In order to get `logo.png` use this route: `/auth/file/img/logo.png`.

Ex:

**main.pug**
```pug
img(src="/auth/file/img/logo.png")
```

## Fooll Settings
This section describes the settings that server gets as arguments. Do you remember the simplest server setup ? Let's know how make it more complicated.
### Port
The default port in which the server listens is `3000`. To change it just pass it to server.

Ex
```javascript
var server = new Fooll({
  port: 8080
});
```

Now, the server will listen on port `8080`.
### Env
`env` is for project environment. By default it is set to 'development'
### Aliases
Aliases gives you the possiblity to edit module names in route.

For instance, imagine you want to replace your `auth` module by `sign` in route, you do:
```javascript
var server = new Fooll({
  aliases: {
    'sign': 'auth'
  }
});
```
Now when you request: get `/sign/doit`, Fooll will look for `GET_doit(req, res)` in **`auth`** module.

#### Project root routes
Aliases are helpful for setting up a module to run in project root routes. For instances, you want to run the module `home` when the user requests `www.mysite.com`, you just have to do:
```javascript
var server = new Fooll({
  aliases: {
    '': 'home'
  }
});
``` 
Now when you request: get `www.mysite.com`, Fooll will look for `GET_root(req, res)` in **`home`** module.
### Serving global static files
In every project you have certain files that are global such as css style, website logo... 
It's not handy to copy each one of them in every module's client folder. Instead you can put them in a folder in your project's root and request them through a unified route style.
To make this we have two attributes:
```javascript
var server = new Fooll({
  staticModuleName: 'file',
  staticFolder: 'public'
  // These are their default values
});
```
Now when you request: get `www.mysite.com/file/logo.png`, Fooll will return `public/logo.png` file.

### Session Secret
`sessionSecret` sets the session encryption secret. By default it is 'secret'
*(We'll see sessions in req & res respectives apis)*

### Not Found View

`notFoundView` is the html returned when the route returns an error **404**. By default it is '<h1>404 Not Found</h1>'

### Extra

In `extra` you can put anything you want.

## Fooll methods

### addHook
Fooll's hooks are like middlewares in express with one difference, they are called in every request.

Ex:
```javascript
server.addHook(function(req, res, next){
  console.log("I'm a hooooooooooooook");
  next();
});
```
Now in every request you'll see this line in the console.

#### Express middlewares as hooks

As you can guess, existing express midllewares can be used as hooks.
> Keep In Mind: They are called on every request.

### listen
This is finally the method that will make your app available on browser. 

Ex:
```javascript
server.listen(#port);
```

port is an optional integer, if provided it will overwrite the existing `server.port` value.

## req API

These are additional attributes created by Fooll in both req and res objects.

- req.moduleName:
  The requested module name.
- req.action:
  The requested action name.
- req.operation:
  The function name that will be called on this request.
- req.params:
  The request params.

  Ex:
  ```javascript
  GET /auth/login/omar/123456
  // req.moduleName = 'auth'
  // req.action = 'login'
  // req.operation = 'GET_login'
  // req.params = ['omar', '123456']
  ```
- req.session:
  Object containing session values with their names.

- req.server:
  Server

## res API

- res.setSession('name', 'value'):
  Create new session attribute. Ex:
  ```javascript
  res.setSession('userId', 50);
  ```
- res.redirect('location'):
  Redirects to given url. Ex:
  ```javascript
  res.redirect('/');
  ```
- res.json({obj}):
  Responds with json object. Ex:
  ```javascript
  res.json({id: 50, username: 'omar'});