const chat = require('../chat');
const game = require('../game');

module.exports = function(message) {
  const player = game.players.find(p => p.playerID === message.playerID);
  const playerName = player ? player.playerName : '?'; // in the rare event of a race condition
  chat.writeMessage(playerName, message.chatText);
};
