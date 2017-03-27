const http = require('http');
const fs = require('fs');
const path = require('path');
const hooks = require('./hooks');
const errors = require('full-errors');

class Full {

  constructor(settings) {
    // Declaring default values
    settings = settings || {};
    this.port = settings.port || 3000;
    this.sessionSecret = settings.sessionSecret || 'secret';
    this.notFoundView = settings.notFoundView || '<h1>404 Not Found</h1>';
    this.prefixes = settings.prefixes || {};
    this.staticModuleName = settings.staticModuleName || 'static';
    this.staticFolder = settings.staticFolder || 'public';
    this.hooks = hooks;
    this.extra = settings.extra || {};

    this.errors = errors;

    var context = this;
    this.server = http.createServer(function (req, res) {
      context.handleRequest(req, res)
    });
    this.loadModules();
  }

  loadModules() {
    var modules = {};
    var dir = fs.readdirSync('./app_modules');
    dir.forEach(function (moduleName) {
      var modulePath = path.resolve('.', 'app_modules', moduleName);
      var stat = fs.lstatSync(modulePath);
      if (stat.isDirectory()) {
        var importedClass = require(modulePath);
        modules[moduleName] = new importedClass(modulePath);
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
    for (var i = 0; i < this.hooks.length && !res.finished; i++) {
      this.hooks[i](req, res, this);
    }
  }

  listen(port) {
    if (port) this.port = port;
    var context = this;
    this.server.listen(context.port, function () {
      console.log("Server listening on: http://localhost:%s", context.port);
    });
  }

}

module.exports = Full;
