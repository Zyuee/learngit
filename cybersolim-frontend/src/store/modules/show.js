/**
 * 控制部件显示状态
 */
import * as types from '../mutation-types'
import * as actionTypes from '../action-types'

const WidgetsShow = {
  state: {
    showModels: false,
    // model building panel
    showModelBuilding: false,
    showShapeWindow: false,
    showUploadShapeWindow: false
  },
  getters: {},
  mutations: {
    [types.SHOW_MODELS]( state, show ){
      state.showModels = show;
    },
    [types.SHOW_MODEL_BUILDING]( state, show ){
      state.showModelBuilding = show;
    },
    [types.SHOW_SHAPE_WINDOW](state, show){
      state.showShapeWindow = show;
    },
    [types.SHOW_UPLOAD_SHAPE_WINDOW](state, show){
      state.showUploadShapeWindow = show;
    }
  },
  actions: {
    [actionTypes.SHOW_MODELS_TABLE]( { state, commit }, show ){
      commit(types.SHOW_MODELS, show);
    },
    [actionTypes.SHOW_MODEL_BUILDING]( { state, commit }, show ){
      commit(types.SHOW_MODEL_BUILDING, show);
    },
    [actionTypes.SHOW_SHAPE_WINDOW]({state, commit}, show){
      commit(types.SHOW_SHAPE_WINDOW, show)
    },
    [actionTypes.SHOW_UPLOAD_SHAPE_WINDOW]({state, commit}, show){
      commit(types.SHOW_UPLOAD_SHAPE_WINDOW, show)
    }
  }
}
export default WidgetsShow;
