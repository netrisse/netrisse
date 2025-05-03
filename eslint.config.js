const ultraMegaConfig = require('eslint-config-ultra-mega');

module.exports = [
  ...ultraMegaConfig,
  {
    languageOptions: {
      globals: {
        document: 'off',
        screen: 'off',
        top: 'off',
      },
    },
  },
];
