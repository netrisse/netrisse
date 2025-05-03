const NetrisseClient = require('./client');
const config = require('./config');
const quit = require('./quit');
const hallway = require('./hallway');
const game = require('./game');
const { debug } = require('netrisse-lib');
const screen = require('./screen');

module.exports = function(seed, intro) {
  screen.clear();
  let cursorY = 3;

  screen.d(2, cursorY, '✨ Welcome to Netrisse! 🎉', { color: 'green' });
  screen.d(5, cursorY += 3, '1) Create / join game  🕹️', { color: 'amber' });
  screen.d(5, cursorY += 2, '2) Back  🔙', { color: 'amber' });
  screen.d(5, cursorY += 2, 'Q) Quit  🚪', { color: 'brightred' });

  screen.render();

  const keyHandler = key => {
    switch (key) {
      case '1':
      {
        screen.removeKeyHandler();
        screen.clear();
        let cursorX = 5;
        let cursorY = 3;

        screen.d(2, cursorY, '✨ Welcome to Netrisse! 🎉', { color: 'green' });
        screen.d(5, cursorY += 3, '1) Create / join game  🕹️', { color: 'amber' });

        const playerNamePrompt = 'Enter your name: ';
        screen.d(cursorX += 4, cursorY += 2, playerNamePrompt, { color: 'brightmagenta' });
        screen.render();

        const playerNameInputCursor = { x: cursorX + playerNamePrompt.length + 1, y: cursorY += 1 };
        let gameNameInputCursor;

        screen.term
          .inputField(
            { ...playerNameInputCursor, default: config.playerName },
          ).promise
          .then(playerName => {
            config.playerName = playerName;
            screen.d(playerNameInputCursor.x - 1, playerNameInputCursor.y - 1, playerName);

            const gameNamePrompt = 'Enter game name: ';
            screen.d(cursorX, cursorY += 1, gameNamePrompt, { color: 'brightmagenta' });
            screen.render();

            gameNameInputCursor = { x: cursorX + gameNamePrompt.length + 1, y: cursorY += 1 };

            return screen.term
              .inputField(
                { ...gameNameInputCursor, default: config.gameName },
              )
              .promise;
          })
          .then(gameName => {
            screen.term.hideCursor();
            config.gameName = gameName;
            screen.d(gameNameInputCursor.x - 1, gameNameInputCursor.y - 1, gameName);
            screen.render();

            const client = new NetrisseClient(config.gameName);
            client.connect(seed)
              .then(() => {
                game.client = client;
                hallway(config.speed);
              })
              .catch(err => {
                debug(err);

                let errMessage;

                if (Array.isArray(err.errors)) {
                  errMessage = err.errors.map(e => e.message);
                }
                else {
                  errMessage = err.message;
                }

                const errorY = gameNameInputCursor.y + 1;
                screen.d(cursorX + 2, errorY, 'Failed to connect:', { color: 'brightred' });
                screen.d(cursorX + 4, errorY + 1, errMessage, { color: 'brightred' });
                screen.d(5, errorY + 3, '2) Back  🔙', { color: 'amber' });
                screen.render();
                screen.keyHandler = keyHandler;
              });
          });

        screen.term.hideCursor(false);

        break;
      }
      case '2':
        screen.removeKeyHandler();
        intro(seed);
        break;
      case 'CTRL_C': case 'ESCAPE': case 'q': case 'Q':
        quit();
        break;
    }
  };

  screen.keyHandler = keyHandler;
};
