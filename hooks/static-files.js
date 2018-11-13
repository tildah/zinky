const path = require('path');

module.exports = function (req, res) {
  if (req.moduleName != req.app.staticModuleName) return;
  var filePath = path.resolve('.', req.app.staticFolder, req.action);
  res.sendFile(filePath);
}