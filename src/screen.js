const termkit = require('terminal-kit');
const packageJSON = require('../package.json');

class Screen {
  colorEnabled;
  screen;
  term;
  #keyHandler;

  constructor() {
    this.term = termkit.terminal;
    this.term.windowTitle('Netrisse');

    // - set ScreenBuffer width and height to larger than the terminal might be
    // - this prevents exceptions when calling screen.get() for points that are outside the visible terminal window
    // - ideally people are making their screen wide enough to show all the board(s), but 🤷
    // - 200 width is enough for seven total boards

    this.screen = new termkit.ScreenBuffer({ dst: this.term, noFill: true, width: 200, height: 50 });

    this.term.hideCursor();
    this.term.grabInput();
  }

  showGameInfo(seed, speed) {
    this.d(24, 19, `Seed:  ${seed}`);
    this.d(24, 20, `Speed: ${speed}ms`);

    this.displayTime();
    this.timeDisplayTimeout = setTimeout(this.displayTime.bind(this), 1000);
  }

  /**
 * draw
 */
  d(x, y, content, { color = 'white', bgColor = 'black' } = { color: 'white', bgColor: 'black' }) {
    const attr = this.colorEnabled ? { color, bgColor } : {};
    this.screen.put({ x, y, attr }, content);
  }

  render(delta = false) {
    this.screen.draw({ delta });
  }

  get(...args) {
    return this.screen.get(...args);
  }

  put(...args) {
    this.screen.put(...args);
  }

  displayTime() {
    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const time = new Intl.DateTimeFormat('en', options).format(date);

    this.d(24, 22, time);

    this.render();
  }

  clear() {
    const attr = this.colorEnabled ? { bgColor: 'black' } : { bgDefaultColor: true };
    this.screen.fill({ attr, region: this.writableArea });
    this.d(0, 0, `Netrisse ${packageJSON.version} (C) 2016  Chris de Almeida           "netrisse -h" for more info`);
  }

  set keyHandler(keyHandler) {
    this.#keyHandler = keyHandler;
    this.term.on('key', this.#keyHandler);
  }

  removeKeyHandler() {
    this.term.removeListener('key', this.#keyHandler);
  }
};

module.exports = new Screen();
