var defaultConfig = require('../webpack.config.js');

var config = Object.assign({}, defaultConfig, {
  entry: {
    'compiled_tests': __dirname + '/spec_runner.js'
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  stats: {
    warnings: false
  }
});

module.exports = config;
