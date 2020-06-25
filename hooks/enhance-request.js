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

  req.resetOpName = () => {
    req.operation = `${req.method}_${req.action}`;
    // When module name is the same as static module join all the path to match
    // the requested file
    if (req.moduleName == req.app.staticModuleName)
      req.action += `/${req.params.join('/')}`;

    // When there is no params in the request, look for the action starting with
    // '$', in order to separate ex: GET users and GET users/<some_id>
    const noParamsOpName = `$${req.operation}`
    if (!req.params.length && req.module && req.module[noParamsOpName])
      req.operation = noParamsOpName;

    // When operation does not exist, make action as root and keep the requested
    // action as ghost, to run BEFORE and AFTER as if it was existing
    if (req.module && !req.module[req.operation]) {
      req.ghostAction = req.action
      req.params.unshift(req.action);
      req.action = "root";
      req.operation = `${req.method}_${req.action}`;
    }

    if (req.ghostAction) req.ghostOperation = `${req.method}_${req.ghostAction}`
  }

  // Parse Cookies
  req.cookies = cookie.parse(req.headers.cookie || '');

  // Parse Operationals
  req.moduleName = correctModuleName(urlParts[start]);
  req.action = correctActionName(urlParts[start + 1]);
  req.params = urlParts.slice(start + 2);
  req.query = urlParsed.query;
  req.module = req.A.mds[req.moduleName];

  req.resetOpName();

}
