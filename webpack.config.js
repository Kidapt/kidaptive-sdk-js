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
  externals: {
    "kidaptive-irt-js": {
      root: 'KidaptiveIrt',
      amd: 'kidaptive-irt-js',
      commonjs: 'kidaptive-irt-js',
      commonjs2: 'kidaptive-irt-js'
    }
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
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