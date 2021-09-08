/**
 * 应用入口
 */
import "izitoast/dist/css/izitoast.min.css";
import 'jspanel4/es6module/jspanel.min.css'
import 'ol-ext/dist/ol-ext.min.css'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import ViewUI from "view-design";
import locale from 'view-design/dist/locale/en-US'
import axios from "axios";
import VueAxios from "vue-axios";

/*
import VueAuth from "@websanova/vue-auth";
import authBearer from '@websanova/vue-auth/drivers/auth/bearer';
import httpAxios from '@websanova/vue-auth/drivers/http/axios.1.x';
import routerVueRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x';
*/


import LazyRender from "vue-lazy-render";
import VueContextMenu from '@xunlei/vue-context-menu';
// 路由
import router from "./router";
// 状态
import store from "./store";
//应用挂载组件
import App from "./App";
import VeeValidate, {Validator} from "vee-validate";
import installRules from "./js/validators";

//引入本地图标
import './assets/iconExtend/iconfont.css';


Vue.use(ViewUI, {locale});

Vue.use(VueContextMenu);
axios.defaults.baseURL = CTX; // webpack环境中配置: my.js
// vue-auth 配置
Vue.use(VueAxios, axios)
Vue.router = router;

// v 3.22
/*Vue.use(VueAuth, {
  auth: authBearer,
  http: httpAxios,
  router: routerVueRouter,
  stores: ['storage'],
  refreshData: {
    interval: 30
  }
});*/
// 2.x
Vue.use(require("@websanova/vue-auth"), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x'),
  refreshData: {
    interval: 30
  },
  tokenStore: ['localStorage', 'cookie'],
  tokenExpired() {
    axios.get('auth/refresh').then().catch(
      error => {
        //if it's Network error, stop auth/refresh
        if (!error.status)
          return false;
        else
          return true;
      }
    )
  }
});
Vue.use(LazyRender); // 延迟渲染
Vue.config.productionTip = false;

const config = {
  aria: true,
  fieldsBagName: 'veeFields',
  strict: true,
  events: 'input|blur'
};
Vue.use(VeeValidate, config);
installRules(Validator);

// 全局进度条
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  next();
});

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
