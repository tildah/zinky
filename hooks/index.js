const prefix = "zinky-";
const enhanceResponse = require("./enhance-response");
const enhanceRequest = require("./enhance-request");
const logRequest = require("./log-request");
const staticFiles = require("./static-files");
const validateRequest = require("./validate-request");
const callAction = require("./call-action");
const beforeAction = require("./before-action");
const moduleHook = require("./module-hook");
const parseBody = require("co-body");
const cookieParser = require('cookie-parser');

module.exports = function (settings) {
  return [
    cookieParser(),
    async req => { req.body = await parseBody(req, settings.bodyParserOptions); },
    enhanceResponse,
    enhanceRequest,
    logRequest,
    staticFiles,
    validateRequest,
    moduleHook,
    beforeAction,
    callAction
  ];
}