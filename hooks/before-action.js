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
    await req.A.runORCatch(h.fn.bind(h.module), req, res);
  }
  
  const guardName = `BEFORE_${req.operation}`;
  const ghostGuardName = `BEFORE_${req.ghostOperation}`;
  const $$ghostGuardName = `$$${ghostGuardName}`;

  const guard = req.module && req.module[guardName];
  const ghostGuard = req.module && req.module[ghostGuardName];
  const $$ghostGuard = req.module && req.module[$$ghostGuardName];
  const [, ...ghostParams] = req.params;
  if (ghostGuard)
    await req.A.runORCatch(ghostGuard.bind(req.module), req, res, ghostParams);
  if (guard)
    await req.A.runORCatch(guard.bind(req.module), req, res);
  if ($$ghostGuard)
    await req.A.runORCatch($$ghostGuard.bind(req.module), req, res, ghostParams);
}
