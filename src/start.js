const Board = require('./board');
const game = require('./game');
const directions = require('./directions');
const algorithms = require('./algorithms');
const quit = require('./quit');
const mainBoardPosition = require('./main-board-position');
const { messageTypeEnum } = require('netrisse-lib');
const screen = require('./screen');

const withResolvers = require('promise.withresolvers');
withResolvers.shim();

module.exports = function(speed) {
  let thisPlayerIsPaused = false;
  let thisPlayerID = game.client?.playerID || 0;

  const players = game.client ? game.players.length : 1;

  screen.term.hideCursor();
  screen.clear();

  screen.showGameInfo(game.seed, speed);
  game.speed = speed;
  game.algorithm = algorithms.frustrationFree;
  const board = new Board(mainBoardPosition, screen, game, thisPlayerID);

  game.boards.push(board);

  if (game.client) {
    thisPlayerID = game.client.playerID;

    for (const player of game.players.filter(p => p.playerID !== thisPlayerID)) {
      const xOffset = 1;
      const boardPosition = {
        top: mainBoardPosition.top,
        right: (mainBoardPosition.right * 3) + xOffset,
        bottom: mainBoardPosition.bottom,
        left: (mainBoardPosition.right * 2) + xOffset,
      };
      const b = new Board(boardPosition, screen, game, player.playerID);
      game.boards.push(b);
      game.pause(true, player.playerID);
    }
  }

  if (players >= 1) {
    // for a multi-player game, pause at the start to allow players to join
    // for a single player game, also pause at the start...
    thisPlayerIsPaused = true;
    game.pause(true, thisPlayerID);
  }

  screen.term.on('key', name => {
    // the called methods should send the necessary message to the server, as there is no point in sending if it's a no-op (quick return)
    switch (name) {
      case 'j': case 'J': case 'LEFT':
        board.currentShape?.move(directions.LEFT);
        break;
      case 'k': case 'K': case 'UP':
        board.currentShape?.move(directions.ROTATE_LEFT);
        break;
      case 'l': case 'L': case 'RIGHT':
        board.currentShape?.move(directions.RIGHT);
        break;
      case ' ':
        board.currentShape?.move(directions.DROP);
        break;
      case 'm': case 'M': case 'DOWN':
        board.currentShape?.move(directions.DOWN);
        break;
      case 'h': case 'H':
        board.holdShape();
        break;
      case 'p': case 'P':
      {
        thisPlayerIsPaused = !thisPlayerIsPaused;
        const messageType = thisPlayerIsPaused ? messageTypeEnum.PAUSE : messageTypeEnum.UNPAUSE;
        game.client?.sendMessage(messageType, {});
        game.pause(thisPlayerIsPaused, thisPlayerID);
        break;
      }
      case 'CTRL_C': case 'ESCAPE': case 'q': case 'Q':
        quit();
        break;
      default:
        break;
    }
  });

  function writeDebugInfo() { // eslint-disable-line no-unused-vars
    console.log(`seed: ${game.seed}`);
    console.log(JSON.stringify(board.moves));
  }
};
