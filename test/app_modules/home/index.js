const Zinko = require('zinko');

class Home extends Zinko {

  BEFORE_GET_root() {
    console.log("1: I am the personal guardian of home root")
  }

  GET_root() {
    return "ok";
  }

  AFTER_GET_root() {
    console.log("2: I run after home root")
  }

}

module.exports = Home;
