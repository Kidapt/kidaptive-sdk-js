var webpack = require('webpack');

var config = {
  entry: {
    'kidaptive-sdk': __dirname + '/src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
    library: 'KidaptiveSdk',
    library: {
      root: "KidaptiveSdk",
      amd: "kidaptive-sdk-js",
      commonjs: "kidaptive-sdk-js"
    },
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    })
  ]
};

module.exports = config;