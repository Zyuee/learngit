var path = require('path');
var webpack = require('webpack');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
const { VueLoaderPlugin } = require('vue-loader');
// 自定义webpack配置
var myConfig = require('../config/my');

var node_modules = path.resolve(__dirname, 'node_modules');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath,
        libraryTarget: 'umd' // for externals
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    plugins: [
        myConfig.babelHappyPack,
        myConfig.providePlugin,
        new VueLoaderPlugin()
    ],
    module: {
        rules: [{
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                exclude: [/node_modules/, /ol3-ext-dir/, /ol/],
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=babel',
                // loader: 'babel-loader',
                include: [resolve('src'), resolve('test')],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
};
