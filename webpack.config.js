var config = {
    entry: {
        'kidaptive_sdk': __dirname + '/src/kidaptive_sdk.js'
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
            amd: "kidaptive_sdk",
            commonjs: "kidaptive_sdk"
        },
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
    }
};

module.exports = config;
