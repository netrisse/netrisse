const ultraMegaConfig = require('eslint-config-ultra-mega');

module.exports = [
  ...ultraMegaConfig,
  {
    languageOptions: {
      globals: {
        clearTimeout: 'false',
        console: 'false',
        module: 'false',
        require: 'false',
        setTimeout: 'false',
        structuredClone: 'false',
      },
    },
  },
];
