const config = require('./config');

class Chat {
  chatBuffer;
  chatMessageMaxLength;
  screen;
  width;
  top;
  left;
  inputCursor;

  writeMessage(playerName, message) {
    // save the current cursor position since it moves when we write a message
    const cursorPosition = structuredClone(this.inputCursor);

    const lines = this.formatMessage(`${playerName}:${message}`, this.chatMessageMaxLength);

    // remove old lines
    this.chatBuffer.splice(0, lines.length);

    // append new lines
    this.chatBuffer.push(...lines);

    for (let i = 0; i < this.chatBuffer.length; i++) {
      const line = this.chatBuffer[i];
      const colonIndex = line.indexOf(':');

      if (line === '' || colonIndex < 0) {
        // line blank or message too long to fit on the same line as username
        this.screen.d(this.left + 1, this.top + 3 + i, line.padEnd(this.width));
        continue;
      }

      const lineName = line.slice(0, colonIndex);
      const lineMessage = line.slice(colonIndex + 1);

      // write player name
      if (config.playerName === lineName) {
        this.screen.d(this.left + 1, this.top + 3 + i, lineName, { color: 'white', bgColor: 'black' });
      }
      else {
        this.screen.d(this.left + 1, this.top + 3 + i, lineName, { color: 'amber', bgColor: 'black' });
      }

      // write message
      this.screen.d(this.left + 1 + lineName.length, this.top + 3 + i, `: ${lineMessage.padEnd(this.width - lineName.length - 2)}`, { color: 'white', bgColor: 'black' });
    }

    this.screen.render(true);
    this.screen.term.moveTo(...Object.values(cursorPosition));
  }

  formatMessage(text, lineLength) {
    const lines = [];
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      if ((line + word).length <= lineLength) {
        line += (line.length > 0 ? ' ' : '') + word;
      }
      else {
        if (line.length > 0) {
          lines.push(line);
          line = word;
        }
        else {
          let splitWord = word;
          while (splitWord.length > lineLength) {
            lines.push(splitWord.slice(0, lineLength));
            splitWord = splitWord.slice(lineLength);
          }
          line = splitWord;
        }
      }
    }
    if (line.length > 0) {
      lines.push(line);
    }

    return lines;
  }
};

module.exports = new Chat();
