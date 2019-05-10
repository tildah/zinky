const coBody = require("co-body");

module.exports = async req => {
  try {
    req.body = await coBody(req, req.A.bodyParserOptions);
  } catch (error) {
    req.body = {};
  }
  if (req.headers['Content-Type'] === "application/json") {
    req.body = JSON.parse(req.body);
  }
}