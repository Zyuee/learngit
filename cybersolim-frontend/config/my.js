// 自定义配置, 参考 utils.js

var path = require('path')
var webpack = require('webpack')
var HappyPack = require('happypack'),
  os = require('os'),
  happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// __dirname: 当前文件所在目录的完整目录名
var libs = path.resolve(__dirname, '../src/libs');
var CopyWebpackPlugin = require('copy-webpack-plugin')

exports.babelHappyPack = new HappyPack({
  id: 'babel',
  threads: 4,
  threadPool: happyThreadPool,
  verbose:true,
  debug:true,
  loaders: ['babel-loader?cacheDirectory=true']
});

/**
 * 在模块中直接使用 $ / jQuery
 * @see https://webpack.js.org/plugins/provide-plugin/
 */
exports.providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  'window.$': 'jquery',
  jQuery: 'jquery'
});

// application variables 应用级别(全局)变量

// dev 时使用
exports.devDefinePlugin = new webpack.DefinePlugin({
  CTX: JSON.stringify("http://localhost:8081/cybersolim/"),
  mapserverUrl:"http://localhost:8091/cgi-bin/mapserv.exe",
  mapFileRootPath:"D:\\egc\\program\\ms4w\\ms4w\\apps\\tutorial\\htdocs\\"
});

// build 时使用
exports.prodDefinePlugin = new webpack.DefinePlugin({
  // build时使用
  CTX: JSON.stringify("/cybersolim/"),
  mapserverUrl:"http://59.110.220.142:8091/cgi-bin/mapserv.exe",
  mapFileRootPath:"D:\\program\\ms4w\\ms4w\\apps\\tutorial\\htdocs"
});


/**
 * 往非npm模块化插件中注入 $ 和 ol，避免出现 $ / ol is not defined
 * @see https://webpack.js.org/loaders/imports-loader/
 * @see https://segmentfault.com/a/1190000007515136
 */
/*
exports.olextImports = {
  test: require.resolve(path.join(libs, "ol-ext/ol-ext.min.js")),
  //test: require.resolve(path.join(libs, "ol-ext/ol3-ext.modified.js")),
  loader: "imports-loader?$=jquery,ol=openlayers"
}
*/
/*
exports.pnotifyImports = {
  test: /pnotify.*\.js$/,
  loader: "imports-loader?define=>false,global=>window,$=jquery"
}

exports.notyImports = {
  test: /noty.*\.js$/,
  loader: "imports-loader?$=jquery"
}


exports.jspanelImports = {
  test: /jspanel.*\.js$/,
  loader: "imports-loader?jQuery=jquery"
}
*/

/**
 * 防止将某些 import 的包(package)打包到 bundle 中，
 * 而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
 * 主要是为了使用cdn
 * 模块名：全局变量
 * @see https://doc.webpack-china.org/configuration/externals/
 */
exports.externals = {
  jquery: 'jQuery',
  openlayers: 'ol',
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  // axios: 'axios',
  // VueAxios: 'vue-axios',
  "view-design": 'iview',
  "iview": 'ViewUI',
  moment: 'moment',
  'vee-validate': 'VeeValidate'
};


// 开发环境下使用静态文件
exports.devContext = path.resolve('./');
exports.devCopyPlugin = new CopyWebpackPlugin([{
  from: path.resolve('./static'),
  ignore: ['.*']
}]);

/**
 * enhance uglify
 * replace defalut UglifyJsPlugin setting
 * @see https://techblog.toutiao.com/2017/02/28/webpack/
 */
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
let uglifyParallel = new UglifyJsParallelPlugin({
  workers: os.cpus().length,
  mangle: true,
  compressor: {
    warnings: false,
    drop_console: true,
    drop_debugger: true
  },
  sourceMap: true
});

exports.uglifyParallelPlugin = uglifyParallel;
