const parser = require('url');
const requestIp = require('request-ip');
const cookie = require('cookie');

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

  // Parse Cookies
  req.cookies = cookie.parse(req.headers.cookie || '');

  // Parse Operationals
  req.moduleName = correctModuleName(urlParts[start]);
  req.action = correctActionName(urlParts[start + 1]);
  req.params = urlParts.slice(start + 2);
  req.query = urlParsed.query;
  req.module = req.A.mds[req.moduleName];
  req.operation = `${req.method}_${req.action}`;

  if (req.moduleName == req.app.staticModuleName)
    req.action += `/${req.params.join('/')}`;

  if (req.module && !req.module[req.operation]) {
    req.params.unshift(req.action);
    req.action = "root";
    req.operation = `${req.method}_${req.action}`;
  }

  const noParamsOpName = `$${req.operation}`
  if (!req.params.length && req.module && req.module[noParamsOpName])
    req.operation = noParamsOpName;

}