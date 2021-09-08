import * as types from '../mutation-types'
import * as actionTypes from '../action-types'
import * as getterTypes from  '../getter-types'

const ModelState = {
  state:{
    showParaWindow:false,
    showEnvWindow:false,
    showDataWindow:false,
    showCheckWindow:false,//add by yrx. 20210205
    graphMangerState:{},
    inputData:null,
    methodName:null,
    methodDomain:null,//add by yrx. 20200801，用于标识方法是属于那个制图领域的，如土壤制图、生境制图、数字地形分析等
    headerTitle:null,//add by yrx. 20200818，用于控制弹窗显示的标题
    transferTitle:null,//用于控制语义选择弹窗左右侧的标题
    typeDataURL:null,//用于控制不同的后台接口url
    //需要一个存储已选选项的容器
    selectedContainer:[],
    //记录当前选择的节点名字
    currentSelectedElementName:null,//add by yrx. 20200819，用于存储当前选择的是哪个节点
    isSingleSelectType:null,//add by yrx. 20200820，用于判断弹窗是多选还是单选
    savedModelDomain:null,//add by wej 20210425
    savedStudyArea:null,//add by wej 20210425
    covariateSelected:null,//add by wej 20210707
    covariateFinished:false,//add by wej 20210707

  },
  mutations:{
    [types.SHOW_PARA_WINDOW](state, show){
      state.showParaWindow = show;
    },
    [types.SHOW_ENV_WINDOW](state, show){
      state.showEnvWindow = show;
    },
    [types.SHOW_DATA_WINDOW](state, show){
      state.showDataWindow = show;
    },
    [types.SHOW_CHECK_WINDOW](state, show){
      state.showCheckWindow = show;
    },
    [types.CHANGE_GRAPH_MANAGER](state, graphState){
      state.graphMangerState  = graphState;
    },
    [types.INIT_TASK_INPUT_DATA](state, inputData){
      state.inputData  = inputData;
    },
    [types.INIT_TASK_Method](state, methodName){
      state.methodName  = methodName;
    },
    [types.INIT_METHOD_DOMAIN](state, methodDomain){//add by yrx. 20200801
      state.methodDomain  = methodDomain;
    },
    [types.HEADER_TITLE](state, headerTitle){//add by yrx. 20200818
      state.headerTitle = headerTitle;
    },
    [types.TRANSFER_TITLE](state, transferTitle){
      state.transferTitle = transferTitle;
    },
    [types.GET_DATA_URL](state, getDataURL){
      state.typeDataURL = getDataURL;
    },
    [types.UPDATE_SELECTED_ITEM](state, selectedItems){
      let resultIndex = (state.selectedContainer || []).findIndex((item) => item.key===selectedItems.key);
      if (resultIndex === -1){
        //如果不存在的话就新增
        state.selectedContainer.push(selectedItems);
      }else {
        //如果存在了的话就更新
        state.selectedContainer[resultIndex].value = selectedItems.value;
      }
    },
    [types.CLEAR_SELECTED_ITEM](state){
      state.selectedContainer = [];
    },
    [types.CURRENT_ELEMENT_NAME](state, currentElementName){
      state.currentSelectedElementName = currentElementName;
    },
    [types.IS_SINGLE_SELECT_TYPE](state, isSingleSelectType){
      state.isSingleSelectType = isSingleSelectType;
    },
    [types.SAVED_MODEL_DOMAIN](state, savedModelDomain){//add by wej. 20210425
      state.savedModelDomain = savedModelDomain;
    },
    [types.SAVED_STUDY_AREA](state, savedStudyArea){//add by wej. 20210425
      state.savedStudyArea = savedStudyArea;
    },
    [types.SELECT_COVARIATE](state, covariateSelected){//add by wej. 20210707
      state.covariateSelected = covariateSelected;
    },
    [types.FINISH_COVARIATE](state, covariateFinished){//add by wej. 20210707
      state.covariateFinished = covariateFinished;
    },

  },
  actions:{
    [actionTypes.SHOW_PARA_WINDOW]({state, commit}, show){
      commit(types.SHOW_PARA_WINDOW, show);
    },
    [actionTypes.SHOW_ENV_WINDOW]({state, commit}, show){
      commit(types.SHOW_ENV_WINDOW, show);
    },
    [actionTypes.SHOW_DATA_WINDOW]({state, commit}, show){
      commit(types.SHOW_DATA_WINDOW, show);
    },
    [actionTypes.SHOW_CHECK_WINDOW]({state, commit}, show){
      commit(types.SHOW_CHECK_WINDOW, show);
    },
    [actionTypes.CHANGE_GRAPH_MANAGER]({state, commit}, graphState){
      commit(types.CHANGE_GRAPH_MANAGER, graphState);
    },
    [actionTypes.INIT_TASK_INPUT_DATA]({state, commit}, inputData){
      commit(types.INIT_TASK_INPUT_DATA, inputData);
    },
    [actionTypes.INIT_TASK_Method]({state, commit}, methodName){
      commit(types.INIT_TASK_Method, methodName);
    },
    [actionTypes.INIT_METHOD_DOMAIN]({state, commit}, methodDomain){//add by yrx. 20200801
      commit(types.INIT_METHOD_DOMAIN, methodDomain);
    },
    [actionTypes.HEADER_TITLE]({state, commit}, headerTitle){
      commit(types.HEADER_TITLE, headerTitle);
    },
    [actionTypes.TRANSFER_TITLE]({state, commit}, transferTitle){
      commit(types.TRANSFER_TITLE, transferTitle);
    },
    [actionTypes.GET_DATA_URL]({state, commit}, getDataURL){
      commit(types.GET_DATA_URL, getDataURL);
    },
    [actionTypes.UPDATE_SELECTED_ITEM]({state, commit}, selectedItems){
      commit(types.UPDATE_SELECTED_ITEM, selectedItems);
    },
    [actionTypes.CLEAR_SELECTED_ITEM]({state, commit}){
      commit(types.CLEAR_SELECTED_ITEM);
    },
    [actionTypes.CURRENT_ELEMENT_NAME]({state, commit}, currentElementName){
      commit(types.CURRENT_ELEMENT_NAME, currentElementName);
    },
    [actionTypes.IS_SINGLE_SELECT_TYPE]({state, commit}, isSingleSelectType){
      commit(types.IS_SINGLE_SELECT_TYPE, isSingleSelectType);
    },
    [actionTypes.SAVED_MODEL_DOMAIN]({state, commit}, savedModelDomain){//add by wej. 20210425
      commit(types.SAVED_MODEL_DOMAIN, savedModelDomain);
    },
    [actionTypes.SAVED_STUDY_AREA]({state, commit}, savedStudyArea){//add by wej. 20210425
      commit(types.SAVED_STUDY_AREA, savedStudyArea);
    },
    [actionTypes.SELECT_COVARIATE]({state, commit}, covariateSelected){//add by wej. 20210707
      commit(types.SELECT_COVARIATE, covariateSelected);
    },
    [actionTypes.FINISH_COVARIATE]({state, commit}, covariateFinished){//add by wej. 20210707
      commit(types.FINISH_COVARIATE, covariateFinished);
    },
  },
  getters: {
    [getterTypes.GET_SELECTED_ITEM]: (state) => (selectedItemKey) =>{
      return state.selectedContainer.filter(item => item.key === selectedItemKey);
    }
  }
}
export default ModelState;
