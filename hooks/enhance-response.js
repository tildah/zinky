const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const cookie = require('cookie');

module.exports = function (req, res) {

  // Setup
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('x-powered-by', 'ZinkyJS');

  res.status = (code) => {
    res.statusCode = code;
  };

  res.contentType = (contentType) => {
    res.setHeader('Content-Type', contentType);
  };

  res.deliver = (code, msg) => {
    res.status(code);
    res.end(String(msg));
  };

  res.send = (msg) => {
    if (typeof msg === "string") res.end(msg);
    else if (typeof msg === "object") res.json(msg);
    else console.warn("Cannot send this type: " + typeof msg)
  }

  // Redirects
  res.redirect = function (location) {
    this.writeHead(302, { 'Location': location });
    this.end();
  }

  res.reload = function (alternative) {
    res.redirect(req.headers.referer || alternative);
  }

  // JSON
  res.json = function (json) {
    this.setHeader("Content-Type", "application/json");
    this.deliver(200, JSON.stringify(json));
  }

  // Files
  res.sendAsFile = function (content, ext) {
    res.setHeader('Content-Type', mime.contentType(ext));
    res.end(content);
  }

  res.sendFile = function (filePath) {
    if (!fs.existsSync(filePath)) throw { statusCode: 404 };
    var fileContent = fs.readFileSync(filePath);
    var fileBase = path.basename(filePath);
    res.sendAsFile(fileContent, fileBase)
  }

  res.download = function (filePath, fileName) {
    var att = 'attachment';
    if (fileName) att += '; filename="' + fileName + '"';
    res.setHeader('Content-Disposition', att);
    res.sendFile(filePath);
  }

  // Cookies
  res.setHeader('p3p', [
    'policyref="http://foo.com/p3p.xml"', 'CP="OOO EEE OOH AH AHH"'
  ]);

  res.cookiesArr = [];

  res.cookie = function (key, val, options) {
    res.cookiesArr.push(cookie.serialize(key, String(val), options));
    res.setHeader('Set-Cookie', res.cookiesArr);
  };

  res.clearOneCookie = function (key, root) {
    var options = { maxAge: Date.now() };
    if (root) options.path = '/';
    res.cookie(key, '', options);
  }

  res.clearCookies = function (root) {
    var cookies = req.cookies;
    for (var prop in cookies) {
      if (!cookies.hasOwnProperty(prop)) {
        continue;
      }
      res.clearOneCookie(prop, root);
    }
  };

  // Render
  let renderFn = req.A.render || function (view, data, layout) {
    let v = view;
    if (layout) v.extends(layout);
    return v.render(data);
  }

  res.render = function (...args) {
    res.end(renderFn(...args));
  }

};