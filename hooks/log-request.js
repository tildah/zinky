const C = require('colors');

module.exports = function (req) {
  var str = '';
  str += C.green(req.method);
  str += ' ' + C.yellow(req.url);
  str += (req.A.logRequestDate ? ' [' + new Date() + ']' : ' | ');
  str += ' Module Name: ' + C.cyan(req.moduleName);
  str += ' | Action: ' + C.magenta(req.action);
  console.log(str);
}