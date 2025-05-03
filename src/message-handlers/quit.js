const game = require('../game');

module.exports = function(message) {
  game
    .getBoardForPlayer(message.playerID)
    ?.quit();
  game.pause(false, message.playerID); // if player quit, remove their pause
};
