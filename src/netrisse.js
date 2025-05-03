#!/usr/bin/env node

const MersenneTwister = require('mersenne-twister');
const screen = require('./screen');
const intro = require('./intro');
const quit = require('./quit');
const { debug } = require('netrisse-lib');

try {
  // multiplayer game modes:  battle (default), friendly
  // need to wait to start the game until all players are ready (2nd board is not null)

  screen.colorEnabled = true;

  const seed = new MersenneTwister().random_int();

  debug(`seed: ${seed}`);
  intro(seed);
}
catch (e) {
  console.error(e);
  quit();
}
