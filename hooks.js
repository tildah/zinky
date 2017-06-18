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
const render = require(prefix + 'render');
const bodyParser = require('body-parser');

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
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  callAction
];