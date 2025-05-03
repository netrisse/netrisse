const game = require('../game');
const quit = require('../quit');

module.exports = function() {
  game.gameOver();
  quit();
};
