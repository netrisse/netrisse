const game = require('../game');

module.exports = function(message) {
  game.pause(true, message.playerID);
};
