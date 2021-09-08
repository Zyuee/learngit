# vue-webpack-view
# CyberSoLIM 2017 基于Vue-webpack-iView的前端SPA
> vue webpack view

## 使用说明
- 开发阶段，第一次时需要执行`npm install` 或`cnpm install`（node安装淘宝镜像之后），然后执行 `npm run dev`。以后开发时只需要运行 `npm run dev`即可
- 生产部署阶段，即编译源代码、压缩文件后部署到生产服务器（Nginx 或 tomcat）时，才需要根据构建说明中的内容修改并执行`npm run build`
- vuex (位于 store 目录) 的使用请参考 [Vuex 学习](https://github.com/lreis2415/DevelopMemo/blob/master/Javascript/Vue/Vuex-%E5%AD%A6%E4%B9%A0.md)

## 构建步骤
命令行中
``` bash
# 安装依赖

npm install

# serve with hot reload at localhost:8090
# 启动服务，支持热加载（修改之后自动编译自动更新，不用刷新页面）
# 默认是8080，为避免与tomcat的冲突，进行了修改:8090（config/index.js）

npm run dev

# build for production with minification
# 为生产环境构建并最小化

npm run build

# build for production and view the bundle analyzer report
# 查看bundle文件分析

npm run build --report

# run unit tests

npm run unit

# run e2e tests

npm run e2e

# run all tests

npm test
```

## 构建说明
>  *为了开发时方便快捷，直接使用安装到本地的npm模块依赖，而为了发布时减少打包文件的体积和加载时间，需要使用CDN*
>
> 使用了gzip压缩，后端Spring MVC 及服务器需要做出相应的设置，支持gzip
>
> **开发时不需要进行这部分处理，只有在开发之后需要部署到生产环境才需要执行构建（`npm run build`）操作**


### build之前
> build 之后需要改回来，以便于开发

1. index.html 文件处理

   在build阶段使用了`index-prod.html`作为HTML模板，内部配置了相关库的CDN地址。
   必要时，修改内容，如版本。

2. `constVariable.js`
根据本机公网IP修改`src\components\constVariable.js`文件中的 build 部分 MAPSERVER 及  DATAFILENAME 地址。
暂时注释掉 dev 部分，build 之后再改回来。如：
```javascript
//build
const MAPSERVER = 'http://59.110.220.142:8091/cgi-bin/mapserv.exe?';
const DATAFILENAME = 'http://59.110.220.142:80/egcDataFiles/';
//dev
//const MAPSERVER = 'http://localhost:8091/cgi-bin/mapserv.exe?';
//const DATAFILENAME = 'http://localhost:80/egcDataFiles/';
```

### build之后
  在`/config/index.js`文件中，可通过`module.exports` 中的`build`中的`index`和`assetsRoot`配置build之后的文件发布路径。

  - 若将前端部署到 Tomcat 或J etty 下访问，则可以设置其值为'cybersolim-web/src/main/webapp/WEB-INF/view'，即build之后直接部署到了服务器。

  - 如果使用Nginx，可以将`build`配置下的相关路径改为默认的 dist 目录，并将`dist`目录拷贝到 Nginx 目录下，改为 cybersolim


#### 如果`npm install`失败
```shell
npm ERR! phantomjs-prebuilt@2.1.14 install: `node install.js`
npm ERR! Exit status 1
```
试试：

`npm install phantomjs-prebuilt@2.1.14 --ignore-scripts`

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
