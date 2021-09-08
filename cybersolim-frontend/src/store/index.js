/**
 * 组装模块并导出 store
 * @author houzhiwei
 */
import Vue from "vue";
import Vuex from "vuex";
import UserJpg from "../assets/img/user.jpg";
// import getters from './getters'
import actions from "./actions";
import DataState from "./modules/datasets";
import MapState from "./modules/map";
import WidgetsShowState from "./modules/show";
import SeimsState from "./modules/seims";
import mutations from "./mutations";
import ModelState from "./modules/visualModeling";
import ProjectSate from "./modules/projects"
import UserState from "./modules/user"
Vue.use(Vuex);

const state = {
  // 地图对象
  basemap: {},
  user: {
    name: 'user',
    img: UserJpg,
    email: 'houzw@leris.ac.cn',
    fname: 'v',
    lname: 'vv'
  },
  popupLayer: null,
  currentLegendName: '',
  currentLegendUrl: ''
};
const store = new Vuex.Store({
  state,
  // 组合各个模块
  modules: {
    MapState,
    WidgetsShowState,
    DataState,
    ModelState,
    ProjectSate,
    UserState,
    SeimsState,
  },
  actions,
  mutations,
  // getters
});

export default store;
