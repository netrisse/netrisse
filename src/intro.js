const config = require('./config');
const start = require('./start');
const quit = require('./quit');
const multiplayer = require('./multiplayer');
const screen = require('./screen');
const game = require('./game');

module.exports = function intro(seed) {
  let cursorY = 3;

  screen.clear();
  screen.d(2, cursorY, '✨ Welcome to Netrisse! 🎉', { color: 'green' });
  screen.d(5, cursorY += 3, '1) Single player  🧍', { color: 'amber' });
  screen.d(5, cursorY += 2, '2) Multiplayer  🧑‍🤝‍🧑', { color: 'amber' });
  screen.d(5, cursorY += 2, '3) Options  🔧', { color: 'amber' });
  screen.d(5, cursorY += 2, 'Q) Quit  🚪', { color: 'brightred' });
  screen.render();

  const keyHandler = key => {
    switch (key) {
      case '1':
        screen.removeKeyHandler();
        game.seed = seed;
        start(config.speed);
        break;
      case '2':
        screen.removeKeyHandler();
        multiplayer(seed, intro);
        break;
      case 'CTRL_C': case 'ESCAPE': case 'q': case 'Q':
        quit();
        break;
    }
  };

  screen.keyHandler = keyHandler;
};
