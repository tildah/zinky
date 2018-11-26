const coBody = require("co-body");

module.exports = req => {
  try {
    req.body = await coBody(req, settings.bodyParserOptions);
  } catch (error) {
    req.body = {};
  }
}