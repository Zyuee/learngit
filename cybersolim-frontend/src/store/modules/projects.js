/**
 * 项目管理状态
 * @author houzhiwei
 * @date 2018/4/9 11:23
 */
import * as types from "../mutation-types";
import * as actionTypes from "../action-types";

const ProjectState = {
  state: {
    showProjects: false,
    showProjectDetail: false,
    refreshProjects:false,
    runModelFinished:false,
    projectId: -1
  },
  actions: {
    [actionTypes.SHOW_PROJECTS_TABLE]( { state, commit }, show ){
      commit(types.SHOW_PROJECTS, show);
    },
    [actionTypes.SHOW_PROJECT_DETAIL]( { state, commit }, show ){
      commit(types.SHOW_PROJECT_DETAIL, show);
    },
    [actionTypes.PROJECT_DETAIL_ID]( { state, commit }, show ){
      commit(types.SHOW_PROJECT_DETAIL_ID, show);
    },
    [actionTypes.REFRESH_PROJECTS]( { state, commit }, refresh ){
      commit(types.DO_REFRESH_PROJECTS, refresh);
    },
    [actionTypes.RUN_MODEL_FINISHED]( { state, commit }, finished ){
      commit(types.CHANGE_RUN_MODEL_FINISHED, finished);
    }
  },
  mutations: {
    [types.SHOW_PROJECTS]( state, show ){
      state.showProjects = show;
    },
    [types.SHOW_PROJECT_DETAIL]( state, show ){
      state.showProjectDetail = show;
    },
    [types.SHOW_PROJECT_DETAIL_ID]( state, id ){
      state.projectId = id;
    },
    [types.DO_REFRESH_PROJECTS]( state, refresh ){
      state.refreshProjects = refresh;
    },
    [types.CHANGE_RUN_MODEL_FINISHED]( state, finished ){
      state.runModelFinished = finished;
    }

  }
}

export default ProjectState;
