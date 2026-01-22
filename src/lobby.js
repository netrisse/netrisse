const start = require('./start');
const quit = require('./quit');
const config = require('./config');
const game = require('./game');
const { messageTypeEnum } = require('netrisse-lib');
const chat = require('./chat');
const screen = require('./screen');

class Lobby {
  load() {
  // escape/sanitize input?
  // bind to a ctrl+something to start game
  // once everyone is ready, countdown?
  // TODO: player list in lobby...

    screen.clear();

    const topBorder    = '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓';  // eslint-disable-line @stylistic/js/no-multi-spaces
    const separator    = '┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫';  // eslint-disable-line @stylistic/js/no-multi-spaces
    const bottomBorder = '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛';

    const top = 2;
    const right = 49;
    const bottom = 23;
    const left = 0;
    const width = 48;  // usable area (without borders)
    const height = 16;  // usable area (without borders)

    const chatMessageMaxLength = width - 1;

    screen.d(left, top + 1, ` Lobby: ${config.gameName}`);
    screen.d(left, top, topBorder);

    for (let i = top + 1; i < bottom; i++) {
      screen.d(left, i, '┃');
    }

    for (let i = top + 1; i < bottom; i++) {
      screen.d(right, i, '┃');
    }

    screen.d(left, top + 2, separator);
    screen.d(left, bottom - 2, separator);
    screen.d(left, bottom, bottomBorder);

    screen.render();

    chat.screen = screen;
    chat.width = width;
    chat.top = top;
    chat.left = left;
    chat.chatBuffer = Array.from({ length: height }, () => '');
    chat.chatMessageMaxLength = chatMessageMaxLength;

    bindChatInput(top, right, bottom, left, width, chatMessageMaxLength);
  }

  refreshPlayerList() {
    const topBorder    = '┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓';  // eslint-disable-line @stylistic/js/no-multi-spaces
    const separator    = '┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫';  // eslint-disable-line @stylistic/js/no-multi-spaces
    const bottomBorder = '┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛';

    const top = 2;
    const right = 79;
    const bottom = 12; // this allows for listing the current maximum number of players (seven)
    const left = 52;

    screen.d(left, top + 1, ` Players in lobby`);
    screen.d(left, top, topBorder);

    for (let i = top + 1; i < bottom; i++) {
      screen.d(left, i, '┃');
    }

    for (let i = top + 1; i < bottom; i++) {
      screen.d(right, i, '┃');
    }

    screen.d(left, top + 2, separator);
    screen.d(left, bottom, bottomBorder);

    for (let i = 0; i < game.players.length; i++) {
      const p = game.players[i];
      screen.d(left + 1, top + 3 + i, p.playerName);
    }

    screen.render(true);
  }
}

function bindChatInput(top, right, bottom, left, width, chatMessageMaxLength) {
  chat.inputCursor = { x: left + 2, y: bottom };

  const inputField = screen.term
    .inputField(
      {
        ...chat.inputCursor,
        maxLength: chatMessageMaxLength,
        echo: false,
        keyBindings: {
          BACKSPACE: 'backDelete',
          ENTER: 'submit',
          LEFT: null, // this would require more code for cursor management. do nothing for now
          RIGHT: null, // this would require more code for cursor management. do nothing for now
        },
      },
    );

  inputField.promise
    .then(message => {
      screen.removeKeyHandler();

      if (message.trim() !== '') {
        game.client.sendMessage(messageTypeEnum.CHAT, { chatText: message });
        chat.writeMessage(config.playerName, message, true);
      }

      bindChatInput(top, right, bottom, left, width, chatMessageMaxLength);
    });

  clearInput(screen, chat.inputCursor, chatMessageMaxLength);
  screen.d(right, bottom - 1, '┃');
  screen.render();
  screen.term.moveTo(...Object.values(chat.inputCursor));
  screen.term.hideCursor(false);

  let chatMessage;

  const keyHandler = key => {
    switch (key) {
      case 'CTRL_C': case 'ESCAPE':
        quit();
        break;
      case 'CTRL_S':
        screen.removeKeyHandler();
        game.client.sendMessage(messageTypeEnum.START);
        start(config.speed);
        break;
      default:
        if (chatMessage !== inputField.getInput()) {
          chatMessage = inputField.getInput();
          screen.d(chat.inputCursor.x - 1, chat.inputCursor.y - 1, chatMessage.padEnd(chatMessageMaxLength));
          screen.render(true); // only render delta to prevent cursor flash
          screen.term.moveTo(chatMessage.length + 2, chat.inputCursor.y);
        }
        break;
    }
  };

  screen.keyHandler = keyHandler;
}

function clearInput(screen, inputCursor, chatMessageMaxLength) {
  screen.d(inputCursor.x - 1, inputCursor.y - 1, ''.padEnd(chatMessageMaxLength));
}

module.exports = new Lobby();
