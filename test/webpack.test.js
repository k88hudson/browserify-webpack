var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js/,
                loaders:  ['es6', 'jsx-loader', 'transform?brfs'],
                exclude: /node_modules/
            }
        ]
    }
};
