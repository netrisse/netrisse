const game = require('../game');

module.exports = function(message) {
  game
    .getBoardForPlayer(message.playerID)
    ?.quit();
};
