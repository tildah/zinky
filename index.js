const http = require('http');
const fs = require('fs');
const path = require('path');
const hooks = require('./hooks');
const errors = require('zinky-errors');
const emitter = new (require('events').EventEmitter)();
const C = require('colors');

class Zinky {

  constructor(settings) {
    // Declaring default values
    settings = settings || {};
    this.port = settings.port || 3000;
    this.aliases = settings.aliases || {};
    this.staticModuleName = settings.staticModuleName || 'file';
    this.staticFolder = settings.staticFolder || 'public';
    this.logRequestDate = false || settings.logRequestDate;
    this.stopPugLayout = false || settings.stopPugLayout;
    this.env = settings.env || 'development';
    if (typeof settings.catcher === "function") this.catcher = settings.catcher;
    if (typeof settings.render === "function") this.render = settings.render;
    this.hooks = hooks(settings);
    for (var key in settings) {
      if (settings.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }


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
        try {
          var importedClass = require(modulePath);
          modules[moduleName] = new importedClass(modulePath, this);
        } catch (error) {
          console.warn(error);
        }
      }
    });
    this.modules = modules;
    this.mds = this.modules;
  }

  correctModuleName(string) {
    var aliasedModule = this.aliases[string];
    return (aliasedModule !== undefined) ? aliasedModule : string;
  }

  correctActionName(string) {
    return string == '' ? 'root' : string;
  }

  addHook(fn) {
    this.hooks.splice(-3, 0, fn);
  }

  catcher(req, res) {
    console.log(req.error);
    res.deliver(500, 'Internal Server Error');
  }

  runORCatch(fn, req, res, next, context) {
    var asy = 'AsyncFunction',
      fnTxt = 'function';
    if (fn[Symbol.toStringTag] === asy || typeof fn.then == fnTxt) {
      fn.call(context, req, res, next).catch((e) => {
        req.error = e;
        this.catcher(req, res);
      });
    } else {
      try {
        fn.call(context, req, res, next);
      } catch (e) {
        req.error = e;
        this.catcher(req, res);
      }
    }
  }

  handleRequest(req, res) {
    req.app = this;
    req.A = req.app;
    res.on('finish', () => {
      this.onFinishRequest(req, res);
    })
    var step = i => {
      if (i < this.hooks.length && !res.finished) {
        this.runORCatch(this.hooks[i], req, res, () => {
          if (this.hooks[i + 1]) {
            step(i + 1);
          }
        })
      }
    }
    step(0);
  }

  onFinishRequest(req, res) {
    var hookName = 'AFTER_' + req.moduleName + '_' + req.operation;
    for (var moduleName in req.A.modules) {
      if (req.A.modules[moduleName][hookName]) {
        var module = req.A.modules[moduleName];
        this.runORCatch(module[hookName], req, res, null, module)
      }
    }
    var hName = 'AFTER_' + req.operation;
    if (req.module && req.module[hName])
      this.runORCatch(req.module[hName], req, res, null, req.module)
  }

  listen(port) {
    if (port) this.port = port;
    this.server.listen(this.port, () => {
      console.log("Server listening on: http://localhost:%s", this.port);
    });
  }

}

module.exports = Zinky;