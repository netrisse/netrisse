const start = require('../start');
const config = require('../config');
const screen = require('../screen');

module.exports = function() {
  screen.removeKeyHandler();
  start(config.speed);
};
