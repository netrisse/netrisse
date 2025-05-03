const game = require('./game');
const screen = require('./screen');
const mainBoardPosition = require('./main-board-position');

module.exports = function(message) {
  for (const b of game.boards) {
    b.stopAutoMoveTimer();
  }
  game.boards[0]?.quit();

  clearTimeout(screen.timeDisplayTimeout);

  screen.term.moveTo(mainBoardPosition.left + 1, mainBoardPosition.bottom + 1);
  screen.term.eraseLine();
  screen.term.hideCursor(false);
  // writeDebugInfo();

  if (game.client) {
    // add reject timeout

    game.client.disconnect();
  }
  else {
    screen.term.grabInput(false); // stop listening for input so the process exits
  }

  if (typeof message === 'string') {
    console.error(message);
  }
};
