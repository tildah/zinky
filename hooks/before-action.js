module.exports = async function (req, res) {
  var hookName = 'BEFORE_' + req.moduleName + '_' + req.operation;
  var beforeHooks = [];
  for (var moduleName in req.app.modules) {
    if (req.app.modules[moduleName][hookName]) {
      beforeHooks.push({
        module: req.app.modules[moduleName],
        fn: req.app.modules[moduleName][hookName]
      });
    }
  }
  for (let i = 0; i < beforeHooks.length && !res.finished; i++) {
    var h = beforeHooks[i];
    await req.A.runORCatch(h.fn, req, res, null, h.module);
  }
  var guardian = req.module && req.module['BEFORE_' + req.operation];
  if (guardian) await req.A.runORCatch(guardian, req, res, null, req.module);
}