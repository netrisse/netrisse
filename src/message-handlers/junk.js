const game = require('../game');

module.exports = function(message) {
  game
    .getBoardForPlayer(message.toPlayerID)
    .receiveJunk(message.junkLines);
};
