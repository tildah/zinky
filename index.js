const http = require('http');
const fs = require('fs');
const path = require('path');
const hooks = require('./hooks');
const errors = require('fooll-errors');

class Fooll {

  constructor(settings) {
    // Declaring default values
    settings = settings || {};
    this.port = settings.port || 3000;
    this.sessionSecret = settings.sessionSecret || 'secret';
    this.notFoundView = settings.notFoundView || '<h1>404 Not Found</h1>';
    this.prefixes = settings.prefixes || {};
    this.staticModuleName = settings.staticModuleName || 'file';
    this.staticFolder = settings.staticFolder || 'public';
    this.extra = settings.extra || {};
    this.env = settings.env || 'development';
    this.hooks = hooks;

    this.errors = errors;

    var context = this;
    this.server = http.createServer(function (req, res) {
      context.handleRequest(req, res)
    });
    this.loadModules();
  }

  loadModules() {
    var modules = {};
    var server = this;
    var dir = fs.readdirSync('./app_modules');
    dir.forEach(function (moduleName) {
      var modulePath = path.resolve('.', 'app_modules', moduleName);
      var stat = fs.lstatSync(modulePath);
      if (stat.isDirectory()) {
        var importedClass = require(modulePath);
        modules[moduleName] = new importedClass(modulePath, server);
      }
    });
    this.modules = modules;
  }

  correctModuleName(string) {
    var prefixedModule = this.prefixes[string];
    return (prefixedModule !== undefined) ? prefixedModule : string;
  }

  correctActionName(string) {
    return string == '' ? 'root' : string;
  }

  addHook(fn) {
    this.hooks.splice(-1, 0, fn);
  }

  handleRequest(req, res) {
    req.server = this;
    var hooks = this.hooks;
    function step(i) {
      if (i < hooks.length && !res.finished) {
        hooks[i](req, res, function () {
          if (hooks[i + 1]) {
            step(i + 1);
          }
        });
      }
    }
    step(0);
  }

  listen(port) {
    if (port) this.port = port;
    var context = this;
    this.server.listen(context.port, function () {
      console.log("Server listening on: http://localhost:%s", context.port);
    });
  }

}

module.exports = Fooll;
