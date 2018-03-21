var defaultConfig = require('./webpack.config.js');

var config = Object.assign({}, defaultConfig, {
    entry: {
        'compiled_tests': __dirname + '/test/spec_runner.js'
    },
    output: {
        path: __dirname + '/test/',
        filename: '[name].js'
    }
});

module.exports = config;
