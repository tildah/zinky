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
    this.aliases = settings.aliases || {};
    this.staticModuleName = settings.staticModuleName || 'file';
    this.staticFolder = settings.staticFolder || 'public';
    this.extra = settings.extra || {};
    this.env = settings.env || 'development';
    this.hooks = hooks;

    this.errors = errors;

    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res)
    });
    this.loadModules();
  }

  loadModules() {
    var modules = {};
    var dir = fs.readdirSync('./app_modules');
    dir.forEach((moduleName) => {
      var modulePath = path.resolve('.', 'app_modules', moduleName);
      var stat = fs.lstatSync(modulePath);
      if (stat.isDirectory()) {
        var importedClass = require(modulePath);
        modules[moduleName] = new importedClass(modulePath, this);
      }
    });
    this.modules = modules;
  }

  correctModuleName(string) {
    var aliasedModule = this.aliases[string];
    return (aliasedModule !== undefined) ? aliasedModule : string;
  }

  correctActionName(string) {
    return string == '' ? 'root' : string;
  }

  addHook(fn) {
    this.hooks.splice(-1, 0, fn);
  }

  handleRequest(req, res) {
    req.server = this;
    res.on('finish', () => {
      this.onFinishRequest(req, res);
    })
    var step = i => {
      if (i < this.hooks.length && !res.finished) {
        this.hooks[i](req, res, () => {
          if (this.hooks[i + 1]) {
            step(i + 1);
          }
        });
      }
    }
    step(0);
  }

  onFinishRequest(req, res) {
    var hookName = 'AFTER_' + req.moduleName + '_' + req.operation;
    for (var moduleName in req.server.modules) {
      if (req.server.modules[moduleName][hookName]) {
        req.server.modules[moduleName][hookName](req, res);
      }
    }
  }

  listen(port) {
    if (port) this.port = port;
    this.server.listen(this.port, () => {
      console.log("Server listening on: http://localhost:%s", this.port);
    });
  }

}

module.exports = Fooll;
