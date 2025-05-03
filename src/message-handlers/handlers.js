const { messageTypeEnum } = require('netrisse-lib');
const connect = require('./connect');
const direction = require('./direction');
const gameOver = require('./game-over');
const hold = require('./hold');
const junk = require('./junk');
const pause = require('./pause');
const quit = require('./quit');
const seed = require('./seed');
const unpause = require('./unpause');
const chat = require('./chat');
const start = require('./start');

const messageHandlers = {};

/* eslint-disable @stylistic/js/no-multi-spaces */

messageHandlers[messageTypeEnum.CONNECT]   = connect;
messageHandlers[messageTypeEnum.DIRECTION] = direction;
messageHandlers[messageTypeEnum.GAME_OVER] = gameOver;
messageHandlers[messageTypeEnum.HOLD]      = hold;
messageHandlers[messageTypeEnum.JUNK]      = junk;
messageHandlers[messageTypeEnum.PAUSE]     = pause;
messageHandlers[messageTypeEnum.QUIT]      = quit;
messageHandlers[messageTypeEnum.SEED]      = seed;
messageHandlers[messageTypeEnum.UNPAUSE]   = unpause;
messageHandlers[messageTypeEnum.CHAT]      = chat;
messageHandlers[messageTypeEnum.START]     = start;

/* eslint-enable */

module.exports = messageHandlers;
