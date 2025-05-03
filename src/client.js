const WS = require('ws');
const uuid = require('uuid');
const { Message, messageTypeEnum } = require('netrisse-lib');
const messageHandlers = require('./message-handlers/handlers');
const config = require('./config');
const { debug } = require('netrisse-lib');
const quit = require('./quit');
const screen = require('./screen');

module.exports = class NetrisseClient {
  gameID;
  playerID;
  server;
  ws;

  constructor(gameID, server = 'localhost:4752') {
    if (typeof gameID === 'undefined') {
      throw new Error('gameID cannot be undefined!');
    }
    else {
      this.gameID = gameID;
    }

    this.server = server;
    this.playerID = uuid.v4();
  }

  connect(seed) {
    this.ws = new WS(`ws://${this.server}`);

    const { promise, resolve, reject } = Promise.withResolvers();

    this.ws.on('error', (e) => {
      debug(e);
      reject(e);
    });

    this.ws.on('open', () => {
      debug('ws connection opened');
      this.sendMessage(messageTypeEnum.CONNECT, { seed, playerName: config.playerName });
      resolve();
    });

    this.ws.on('message', rawData => {
      debug(rawData);
      const message = Message.deserialize(rawData);
      const handler = messageHandlers[message.type];

      if (handler) {
        handler(message);
      }
      else {
        throw new Error(`no handler found for message type ${message.type}`);
      }
    });

    this.ws.on('close', (code, data) => {
      debug(`ws close event -- code: ${code}, data: ${data}`);

      let closeMessage;

      switch (code) { // todo: enum for close codes
        case 4333:
          // called via disconnect()
          break;
        case 4334:
          closeMessage = 'netrisse disconnected due to idle game';
          break;
        case 4335:
          closeMessage = 'netrisse disconnected due to server shutdown';
          break;
        default:
          closeMessage = 'netrisse disconnected for some reason';
          break;
      }

      if (closeMessage) {
        closeMessage = `\n\n${closeMessage} 😿\n`;
      }

      quit(closeMessage);

      screen.term.grabInput(false); // stop listening for input so the process exits
    });

    return promise;
  }

  disconnect() {
    debug('disconnecting');
    this.ws.close(4333, JSON.stringify({ type: messageTypeEnum.QUIT, playerID: this.playerID, gameID: this.gameID })); // todo: make enum for close codes
  }

  sendMessage(type, o) {
    this.ws.send(new Message(type, this.playerID, this.gameID, o).serialize(),
      err => {
        if (err) {
          debug(err);
          throw new Error(err);
        }
      });
  }
};
