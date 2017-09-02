const prefix = "fooll-";
const redirect = require(prefix + 'redirect');
const json = require(prefix + 'json');
const parseUrl = require(prefix + 'parseurl');
const logRequest = require(prefix + 'logrequest');
const setupResponse = require(prefix + 'setupresponse');
const errors = require(prefix + 'errors');
const isRequestingFile = require(prefix + 'isrequestingfile');
const validateRequest = require(prefix + 'validaterequest');
const callAction = require(prefix + 'callaction');
const beforeaction = require(prefix + 'beforeaction');
const render = require(prefix + 'render');
const bodyParser = require('body-parser');
const cookies = require(prefix + 'cookies');
const cookieParser = require('cookie-parser');

module.exports = [
  setupResponse,
  errors,
  redirect,
  json,
  parseUrl,
  logRequest,
  isRequestingFile,
  validateRequest,
  render,
  cookies,
  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  beforeaction,
  callAction
];
