const prefix = "fooll-";
const session = require(prefix + 'session');
const redirect = require(prefix + 'redirect');
const json = require(prefix + 'json');
const parseUrl = require(prefix + 'parseurl');
const logRequest = require(prefix + 'logrequest');
const setupResponse = require(prefix + 'setupresponse');
const isRequestingFile = require(prefix + 'isrequestingfile');
const validateRequest = require(prefix + 'validaterequest');
const callAction = require(prefix + 'callaction');
const bodyParser = require('body-parser');

module.exports = [
  session,
  redirect,
  json,
  parseUrl,
  logRequest,
  setupResponse,
  isRequestingFile,
  validateRequest,
  bodyParser.urlencoded({ extended: false }),
  callAction
];