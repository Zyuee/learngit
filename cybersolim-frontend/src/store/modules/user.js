/**
 * TODO
 * @author houzhiwei
 * @date 2017/6/6 9:36
 */

import * as types from "../mutation-types";
import * as actionTypes from "../action-types";

const UserState = {
  state: {
    showProfile: false,
    showGroup: false,
    showGroupMember: false,
    groupId:-1,
    groupName:'',
    myRole:null,
    isLoggedIn: false
  },
  getters: {},
  mutations: {
    [types.SHOW_USER_PROFILE]( state, show ) {
      state.showProfile = show;
    },
    [types.SHOW_GROUP]( state, show ) {
      state.showGroup = show;
    },
    [types.SHOW_GROUP_MEMBER]( state, show ) {
      state.showGroupMember = show;
    },
    [types.SHOW_GROUP_MEMBER_GROUP_ID]( state, id ) {
      state.groupId = id;
    },
    [types.SHOW_GROUP_MEMBER_GROUP_NAME]( state, name ) {
      state.groupName = name;
    },
    [types.SHOW_GROUP_MEMBER_MY_ROLE]( state, myRole ) {
      state.myRole = myRole;
    }
  },
  actions: {
    [actionTypes.SHOW_USER_PROFILE]( { state, commit }, show ) {
      commit(types.SHOW_USER_PROFILE, show);
    },
    [actionTypes.SHOW_GROUP]( { state, commit }, show ) {
      commit(types.SHOW_GROUP, show);
    },
    [actionTypes.SHOW_GROUP_MEMBER]( { state, commit }, show ) {
      commit(types.SHOW_GROUP_MEMBER, show);
    },
    [actionTypes.SHOW_GROUP_MEMBER_GROUP_ID]( { state, commit }, id ) {
      commit(types.SHOW_GROUP_MEMBER_GROUP_ID, id);
    },
    [actionTypes.SHOW_GROUP_MEMBER_GROUP_NAME]( { state, commit }, name ) {
      commit(types.SHOW_GROUP_MEMBER_GROUP_NAME, name);
    },
    [actionTypes.SHOW_GROUP_MEMBER_MY_ROLE]( { state, commit }, myRole ) {
      commit(types.SHOW_GROUP_MEMBER_MY_ROLE, myRole);
    }
  }
}

export default UserState;
