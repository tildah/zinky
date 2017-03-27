const prefix = "fooll-";
const session = require(prefix + 'session');
const redirect = require(prefix + 'redirect');
const parseUrl = require(prefix + 'parseurl');
const logRequest = require(prefix + 'logrequest');
const setupResponse = require(prefix + 'setupresponse');
const isRequestingFile = require(prefix + 'isrequestingfile');
const validateRequest = require(prefix + 'validaterequest');
const callAction = require(prefix + 'callaction');

module.exports = [
  session,
  redirect,
  parseUrl,
  logRequest,
  setupResponse,
  isRequestingFile,
  validateRequest,
  callAction
];