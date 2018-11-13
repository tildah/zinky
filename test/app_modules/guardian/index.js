const Zinko = require('zinko');

class Guardian extends Zinko {

  BEFORE_home_GET_root() {
    console.log("0: I run Before home root");
  }

}

module.exports = Guardian;
