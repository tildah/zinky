const prefix = "fooll-";
const session = require(prefix + 'session');
const parseUrl = require(prefix + 'parseurl');
const logRequest = require(prefix + 'logrequest');
const setupResponse = require(prefix + 'setupresponse');
const isRequestingFile = require(prefix + 'isrequestingfile');
const validateRequest = require(prefix + 'validaterequest');
const callAction = require(prefix + 'callaction');

module.exports = [
  session,
  parseUrl,
  logRequest,
  setupResponse,
  isRequestingFile,
  validateRequest,
  callAction
];