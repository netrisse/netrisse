const game = require('../game');
const lobby = require('../lobby');

module.exports = function(message) {
  if (message.players.length > 7) {
    throw new Error('player limit is seven');
  }

  game.players = message.players;

  if (!game.started) {
    lobby.refreshPlayerList();
  }
};
