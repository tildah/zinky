const Zinky = require('./../index');

var app = new Zinky({
  aliases: {
    "": "home"
  }
});

app.listen(3000);