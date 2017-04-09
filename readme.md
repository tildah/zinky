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
### Public
### Views
### Settings
### Hooks
### req & res api

- routes
  - first block is for module
  - second block for method - if left blank root method will be called
  - all remaining blocks are parameters
- prefixes
- hooks
- params:
- settings
- views
  - can change views folder name
- serving files
  - file method
  - static module
- session
