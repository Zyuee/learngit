/**
 * 根级别的actions
 * Action 类似于 mutation，不同在于：
 * - Action 提交的是 mutation，而不是直接变更状态。
 * - Action 可以包含任意异步操作。
 * @see https://vuex.vuejs.org/zh-cn/actions.html
 * @author houzhiwei
 */
import * as types from './mutation-types'
import * as actionTypes from './action-types'

const actions = {
  [actionTypes.INIT_MAP]( { commit }, basemap ) {
    commit(types.INIT_MAP, basemap);
  },
  [actionTypes.ADD_MAP_LAYER]( { commit}, layer ){
    let payload = {
      layer:layer
    }
    commit(types.ADD_LAYER, payload);
  },
  [actionTypes.ADD_POPUP_LAYER]({commit}, popupLayer){
    commit(types.ADD_POPUP_LAYER, popupLayer);
  },
  [actionTypes.UPDATE_CURRENT_LEGENT_NAME]({commit}, legendName){
    commit(types.UPDATE_CURRENT_LEGENT_NAME, legendName);
  },
  [actionTypes.UPDATE_CURRENT_LEGENT_URL]({commit}, legendUrl){
    commit(types.UPDATE_CURRENT_LEGENT_URL, legendUrl);
  }
};

export default actions;
