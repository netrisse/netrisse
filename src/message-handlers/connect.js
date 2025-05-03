// message.players
const game = require('../game');

module.exports = function(message) {
  game.players = message.players;
};
