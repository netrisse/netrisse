const game = require('../game');

module.exports = function(message) {
  game.seed = message.seed;
};
