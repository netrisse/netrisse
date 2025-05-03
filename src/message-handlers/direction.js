const game = require('../game');

module.exports = function(message) {
  game
    .getBoardForPlayer(message.playerID)
    .currentShape
    .move(message.direction);
};
