import * as types from '../mutation-types'
import * as actionTypes from '../action-types'

const SeimsState = {
  state: {
    showSeimsModel: false,
    showSeimsManage: false,
    showModelDetail: false,
    modelId: 0
  },
  getters: {},
  mutations: {
    [types.SHOW_SEIMS_MODEL]( state, show ){
      state.showSeimsModel = show;
    },
    [types.SHOW_SEIMS_MANAGE]( state, show ){
      state.showSeimsManage = show;
    },
    [types.SHOW_MODEL_DETAIL]( state, show ){
      state.showModelDetail = show;
    },
    [types.SEIMS_MODEL_ID]( state, id ){
      state.modelId = id;
    }
  },
  actions: {
    [actionTypes.SHOW_SEIMS_MODEL]( { state, commit }, show ){
      commit(types.SHOW_SEIMS_MODEL, show);
    },
    [actionTypes.SHOW_SEIMS_MANAGE]( { state, commit }, show ){
      commit(types.SHOW_SEIMS_MANAGE, show);
    },
    [actionTypes.SHOW_MODEL_DETAIL]( { state, commit }, show ){
      commit(types.SHOW_MODEL_DETAIL, show);
    },
    [actionTypes.SEIMS_MODEL_ID]( { state, commit }, id ){
      commit(types.SEIMS_MODEL_ID, id);
    }
  }
};

export default SeimsState;
