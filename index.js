const http = require('http');
const fs = require('fs');
const path = require('path');
const hooks = require('./hooks');
const allowCors = require("./hooks/allow-cors");

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
    if (settings.allowCors) this.addHook(allowCors);
    for (var key in settings) {
      if (settings.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }


    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res)
    });
    if (!settings.patientMode) this.loadModules();
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

  addHook(fn) {
    this.hooks.splice(-4, 0, fn);
  }

  addHookFromModule(mdName, fn) {
    this.addHook(this.mds[mdName][fn].bind(this.mds[mdName]));
  }

  addTardyHook(fn) {
    this.hooks.splice(-1, 0, fn);
  }

  addTardyHookFromModule(mdName, fn) {
    this.addTardyHook(this.mds[mdName][fn].bind(this.mds[mdName]));
  }

  catcher(req, res) {
    console.log(req.error);
    res.deliver(500, 'Internal Server Error');
  }

  async runORCatch(fn, req, res, next, context) {
    try {
      let r = await fn.call(context, req, res, next);
      if (r) res.send(r);
    } catch (e) {
      req.error = e;
      this.catcher(req, res);
    }
  }

  async handleRequest(req, res) {
    req.app = this;
    req.A = req.app;
    res.on('finish', () => { this.onFinishRequest(req, res); })
    var index = 0;
    while (index < this.hooks.length && !res.finished) {
      await this.runORCatch(this.hooks[index], req, res, () => { });
      index++;
    }
  }

  async onFinishRequest(req, res) {
    var hookName = 'AFTER_' + req.moduleName + '_' + req.operation;
    for (var moduleName in req.A.modules) {
      if (req.A.modules[moduleName][hookName]) {
        var m = req.A.modules[moduleName];
        this.runORCatch(m[hookName], req, res, null, m)
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