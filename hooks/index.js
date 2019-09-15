const enhanceResponse = require("./enhance-response");
const enhanceRequest = require("./enhance-request");
const logRequest = require("./log-request");
const staticFiles = require("./static-files");
const validateRequest = require("./validate-request");
const callAction = require("./call-action");
const beforeAction = require("./before-action");
const moduleHook = require("./module-hook");
const parseBody = require("./parse-body");

module.exports = function () {
  return [
    enhanceResponse,
    enhanceRequest,
    logRequest,
    parseBody,
    staticFiles,
    moduleHook,
    beforeAction,
    validateRequest,
    callAction
  ];
}