const game = require('../game');

module.exports = function(message) {
  if (game.started) {
    game
      .getBoardForPlayer(message.playerID)
      .quit();
    game.pause(false, message.playerID); // if player quit, remove their pause
  }
};
