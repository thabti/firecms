var webpack = require('webpack');
var path = require("path");
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var sassPaths = require("node-neat").includePaths.map(function (sassPath) {
    return "includePaths[]=" + sassPath;
}).join("&");

var distPath = './assets/';

module.exports = {
    debug: true,
    devtool: "#inline-source-map",
    entry: [
        './client/javascript/app.js'],
    styles: ['./client/scss/app.scss'],
    output: {
        path: distPath,
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /(.jsx|.js)?$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer!sass?sourceMap&' + sassPaths)
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx', '.scss']
    },

    plugins: [
        new AssetsPlugin({path: distPath, filename: 'assets.json'}),
        new ExtractTextPlugin('[name].css', {allChunks: true}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                APP_ENV: JSON.stringify('browser')
            }
        })
    ]
};
