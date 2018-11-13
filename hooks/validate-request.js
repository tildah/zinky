module.exports = function (req) {
  var appModule = req.app.modules[req.moduleName];
  var operation = (appModule) ? appModule[req.operation] : undefined;
  if (!operation) throw { statusCode: 404 };
}