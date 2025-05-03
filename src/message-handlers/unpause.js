const game = require('../game');

module.exports = function(message) {
  game.pause(false, message.playerID);
};
