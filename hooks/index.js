const enhanceResponse = require("./enhance-response");
const enhanceRequest = require("./enhance-request");
const logRequest = require("./log-request");
const staticFiles = require("./static-files");
const validateRequest = require("./validate-request");
const callAction = require("./call-action");
const beforeAction = require("./before-action");
const moduleHook = require("./module-hook");
const parseBody = require("./parse-body");
const cookieParser = require('cookie-parser');

module.exports = function (settings) {
  return [
    enhanceResponse,
    enhanceRequest,
    logRequest,
    cookieParser(),
    parseBody,
    staticFiles,
    validateRequest,
    moduleHook,
    beforeAction,
    callAction
  ];
}