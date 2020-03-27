const http = require('http');
const fs = require('fs');
const path = require('path');
const hooks = require('./hooks');
const allowCors = require("./hooks/allow-cors");

class Zinky {

  get defaultSettings() {
    return {
      port: 3000,
      aliases: {},
      staticModuleName: "file",
      staticFolder: "public",
      logRequestDate: false,
      stopPugLayout: false,
      logPoweredBy: true,
      logRequest: true,
      env: "development",
    }
  }

  constructor(settings = {}) {
    Object.assign(this, this.defaultSettings, settings);
    this.hooks = hooks(this);
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

  async runORCatch(fn, req, res, explicitParams) {
    try {
      let r = await fn(req, res, ...(explicitParams || req.params || []));
      if (r !== undefined) res.send(r);
    } catch (e) {
      req.error = e;
      this.catcher(req, res);
    }
  }

  async handleRequest(req, res) {
    req.app = this;
    req.A = req.app;
    res.on('finish', () => { this.onFinishRequest(req, res); })
    let index = 0;
    while (index < this.hooks.length && !res.finished) {
      await this.runORCatch(this.hooks[index], req, res);
      index++;
    }
  }

  async onFinishRequest(req, res) {
    const hookName = 'AFTER_' + req.moduleName + '_' + req.operation;
    for (var moduleName in req.A.modules) {
      if (req.A.modules[moduleName][hookName]) {
        let m = req.A.modules[moduleName];
        this.runORCatch(m[hookName].bind(m), req, res)
      }
    }
    const hName = `AFTER_${req.operation}`;
    if(!req.module) return;
    if(req.module[hName])
        this.runORCatch(req.module[hName].bind(req.module), req, res)

    const ghostHName = `AFTER_${req.ghostOperation}`;
    if(!req.module[ghostHName]) return;
    const [, ...ghostParams] = req.params;
    const method = req.module[ghostHName];
    this.runORCatch(method.bind(req.module), req, res, ghostParams)
  }

  listen(port) {
    if (port) this.port = port;
    this.server.listen(this.port, () => {
      console.log("Server listening on: http://localhost:%s", this.port);
    });
  }

}

module.exports = Zinky;
