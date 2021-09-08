/**
 * 数据集、数据管理状态
 * @author houzhiwei
 * @date 2017/06/10
 */

import * as types from '../mutation-types'
import * as actionTypes from '../action-types'

const DataState = {
  state: {
    showDataSets: false,
    showDataSetDetail:false,
    showShareData:false,
    shareDataId:0,
    shareDataName:'',
    shareDataType:0,
    datasetId:-1,
    treeRefresh:0,
    dataSetLayerRefresh:0,
    layerId:-1,
    showProjectDetail:false,
    projectId:-1,
    soilProperty:'',//用于记录选择的样点属性字段
  },
  getters: {},
  mutations: {
    [types.SHOW_DATASETS]( state, show ){
      state.showDataSets = show;
    },
    [types.SHOW_DATASET_DETAIL](state, show){
      state.showDataSetDetail = show;
    },
    [types.SHOW_DATASET_DETAIL_ID](state,id){
      state.datasetId = id;
    },
    [types.DATASET_REFRESH](state){
      state.treeRefresh = state.treeRefresh + 1;
    },
    [types.LAYER_REFRESH](state){
      state.dataSetLayerRefresh = state.dataSetLayerRefresh + 1;
    },
    [types.SHOW_LAYER_ID](state, id){
      state.layerId = id;
    },
    [types.SELECT_SAMPLE_PROPERTY](state, property){
      state.soilProperty = property;
    },
    [types.SHOW_PROJECT_DETAIL]( state, show ){
      state.showProjectDetail = show;
    },
    [types.SHOW_PROJECT_ID]( state, id ){
      state.projectId = id;
    },
  },
  actions: {
    [actionTypes.SHOW_DATASETS_TABLE]( { state, commit }, show ){
      commit(types.SHOW_DATASETS, show);
    },
    [actionTypes.SHOW_DATASET_DETAIL]( { state, commit }, show ){
      commit(types.SHOW_DATASET_DETAIL, show);
    },
    [actionTypes.SHOW_DATASET_DETAIL_ID]({state, commit }, id){
      commit(types.SHOW_DATASET_DETAIL_ID, id);
    },
    [actionTypes.DATASET_REFRESH]({state, commit }){
      commit(types.DATASET_REFRESH);
    },
    [actionTypes.DATA_SET_LAYER_REFRESH]({state, commit }){
      commit(types.LAYER_REFRESH);
    },
    [actionTypes.SHOW_LAYER_ID]({state, commit}, id){
      commit(types.SHOW_LAYER_ID, id);
    },
    [actionTypes.SELECT_SAMPLE_PROPERTY]({state, commit}, id){
      commit(types.SELECT_SAMPLE_PROPERTY, id);
    },
    [actionTypes.SHOW_PROJECT_DETAIL]({state, commit}, show){
      commit(types.SHOW_PROJECT_DETAIL, show);
    },
    [actionTypes.SHOW_PROJECT_ID]({state, commit }, id){
      commit(types.SHOW_PROJECT_ID, id);
    },
  }
};
export default DataState;
