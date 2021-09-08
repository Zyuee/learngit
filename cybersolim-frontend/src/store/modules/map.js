// 组件级别的Vuex store定义
/**
 * 地图相关状态
 * Vuex 允许我们将 store 分割到模块（module）。
 * 每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块
 */
import * as types from '../mutation-types'
import * as actionTypes from '../action-types'
import MapUtils from '@/components/map/js/utils.js'

const MapState = {
  state: {
    // 浏览器地理定位
    geolocation: {},
    clickGeometry: [],
    studyAreaLayers: []
  },
  getters: {
    // 获取矢量层
    vector(state, getters, rootState) {
      return MapUtils.getVectorLayer(rootState.basemap);
    }
  },
  mutations: {
    /**
     * 添加地图控件，改变basemap状态
     * @param {State} state 模块局部状态(basemap 属于全局状态)
     * @param {Object} payload 载荷（参数）
     */
    [types.ADD_MAP_CONTROL](state, payload) {
      payload.basemap.addControl(payload.control); //call ol.map.addControl()
    },
    /**
     * init geolocation
     * @param {Vuex.State} state
     * @param {ol.Geolocation} location
     */
    [types.INIT_GEOLOCATION](state, geolocation) {
      state.geolocation = geolocation;
    },
    [types.ADD_INTERACTION](state, payload) {
      payload.basemap.addInteraction(payload.interaction);
    },
    // [types.ADD_LAYER]( state, payload ){
    //   payload.basemap.addLayer(payload.layer);
    // },

    [types.REMOVE_INTERACTION](state, payload) {
      payload.basemap.removeInteraction(payload.interaction);
    },
    [types.ADD_OVERLAY](state, payload) {
      payload.basemap.addOverlay(payload.overlay);
    },
    [types.SELECT_MAPPING_AREA](state, mappingArea) {
      state.clickGeometry = mappingArea;
    },
    [types.STUDY_AREA_LAYERS](state, studyAreaLayers) {
      state.studyAreaLayers = studyAreaLayers;
    }
  },
  actions: {
    // 添加地图控件
    [actionTypes.ADD_MAP_CONTROL]({state, commit, rootState}, control) {
      let payload = {
        basemap: rootState.basemap,
        control: control
      };
      // 提交mutation：ADD_MAP_CONTROL，进而改变basemap状态
      commit(types.ADD_MAP_CONTROL, payload);
    },
    // 初始化地理定位
    [actionTypes.INIT_GEOLOCATION]({state, commit}, geolocation) {
      commit(types.INIT_GEOLOCATION, geolocation);
    },
    // 添加地图交互
    [actionTypes.ADD_MAP_INTERACTION]({state, commit, rootState}, interaction) {
      let payload = {
        basemap: rootState.basemap,
        interaction: interaction
      };
      commit(types.ADD_INTERACTION, payload);
    },
    [actionTypes.REMOVE_MAP_INTERACTION]({state, commit, rootState}, interaction) {
      let payload = {
        basemap: rootState.basemap,
        interaction: interaction
      };
      commit(types.REMOVE_INTERACTION, payload);
    },
    // [actionTypes.ADD_MAP_LAYER]( { state, commit, rootState }, layer ){
    //   let payload = {
    //     basemap: rootState.basemap,
    //     layer: layer
    //   }
    //   commit(types.ADD_LAYER, payload);
    // },
    [actionTypes.ADD_MAP_OVERLAY]({state, commit, rootState}, overlay) {
      let payload = {
        basemap: rootState.basemap,
        overlay: overlay
      };
      commit(types.ADD_OVERLAY, overlay);

    },
    [actionTypes.SELECT_MAPPING_AREA]({state, commit}, mappingArea) {
      commit(types.SELECT_MAPPING_AREA, mappingArea)
    },
    [actionTypes.STUDY_AREA_LAYERS]({state, commit}, studyAreaLayers) {
      commit(types.STUDY_AREA_LAYERS, studyAreaLayers)
    }
  }
};

export default MapState;
