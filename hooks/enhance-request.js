const parser = require('url');
const requestIp = require('request-ip');

module.exports = function (req) {
  req.url = decodeURIComponent(req.url);
  var urlParsed = parser.parse(req.url, true);
  var url = decodeURIComponent(urlParsed.pathname);
  var urlParts = url.split('/');
  var start = (urlParts.length == 2) ? 0 : 1;
  req.ip = requestIp.getClientIp(req);

  function correctModuleName(string) {
    var aliasedModule = req.app.aliases[string];
    return (aliasedModule !== undefined) ? aliasedModule : string;
  }

  function correctActionName(string) {
    return string == '' ? 'root' : string;
  }

  req.moduleName = correctModuleName(urlParts[start]);
  req.action = correctActionName(urlParts[start + 1]);
  req.operation = req.method + '_' + req.action;
  req.params = urlParts.slice(start + 2);
  req.query = urlParsed.query;
  req.module = req.A.mds[req.moduleName];
  if (req.moduleName == req.app.staticModuleName) {
    req.action += '/' + req.params.join('/');
  }
}