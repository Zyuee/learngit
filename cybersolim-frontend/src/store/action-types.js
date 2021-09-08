/**
 * Vuex Action Types
 * @authoe houzhiwei
 * @date 2017/5/17.
 */

/* *************************************************************************************** *
 *                                    global map actions                                   *
 * *************************************************************************************** */

/**
 * 初始化地图
 * @param {ol.Map} basemap
 * @type {string}
 */
export const INIT_MAP = "initMap";

/* *************************************************************************************** *
 *                                    module map actions                                   *
 * *************************************************************************************** */

/**
 * 添加ol3地图控件
 * @param {ol.control} control
 * @type {string}
 */
export const ADD_MAP_CONTROL = "addMapControl";
/**
 * 初始化浏览器地理位置定位
 * @param {ol.Geolocation} geolocation
 * @type {string}
 */
export const INIT_GEOLOCATION = "initGeolocation";
/**
 * 添加地图交互动作
 * @type {string}
 */
export const ADD_MAP_INTERACTION = "addMapInteraction";
export const REMOVE_MAP_INTERACTION = "removeMapInteraction";
export const ADD_MAP_LAYER = "addMapLayer";
export const ADD_MAP_OVERLAY = "addMapOverlay";
export const SELECT_MAPPING_AREA = "selectMappingArea";
// select study area layer
export const STUDY_AREA_LAYERS = "studyAreaLayers";
//设置Popup图层，用于显示查询信息
export const ADD_POPUP_LAYER = 'addPopupLayer';
//设置图例控件，用于显示图例
export const UPDATE_CURRENT_LEGENT_NAME = 'updateCurrentLegendName';
export const UPDATE_CURRENT_LEGENT_URL = 'updateCurrentLegendUrl';
/* *************************************************************************************** *
 *                                      show panel actions                                 *
 * *************************************************************************************** */

/**
 * 用户个人信息面板显示状态
 * @param {Boolean} show
 * @type {string}
 */
export const SHOW_USER_PROFILE = "showUserProfile";
export const SHOW_GROUP = "showGroup";
export const SHOW_GROUP_MEMBER = "showGroupMember";
export const SHOW_GROUP_MEMBER_GROUP_ID = "groupId";
export const SHOW_GROUP_MEMBER_GROUP_NAME = "groupName";
export const SHOW_GROUP_MEMBER_MY_ROLE = "myRole";

/**
 * 所有项目管理表格面板显示状态
 * @param {Boolean} show
 * @type {string}
 */
export const SHOW_PROJECTS_TABLE = "showProjectsTable";
export const SHOW_MODELS_TABLE = "showModelsTable"; // all models
export const SHOW_MODEL_BUILDING = "showModelBuilding"; // model building panel
export const SHOW_PROJECT_DETAIL = "showProjectDetail";
export const PROJECT_DETAIL_ID = "projectId";
export const REFRESH_PROJECTS = "refresh";
export const RUN_MODEL_FINISHED = "runModelFinished";
/* *************************************************************************************** *
 *                                 data set & data panel actions                           *
 * *************************************************************************************** */

/**
 * 所有数据集管理表格面板显示状态
 * @param {Boolean} show
 * @type {string}
 */
export const SHOW_DATASETS_TABLE = "showDataSetsTable";
/**
 * 数据集详情
 * @param {Boolean} show
 * @type {string}
 */
export const SHOW_DATASET_DETAIL = "showDataSetDetail";
export const SHOW_DATASET_DETAIL_ID = "datasetId";
export const DATASET_REFRESH = 'dataSetRefresh';
export const DATA_SET_LAYER_REFRESH = 'dataSetLayerRefresh';
export const SHOW_LAYER_ID = 'showLayerId';
export const SELECT_SAMPLE_PROPERTY = 'selectSampleProperty';//用于记录选择的样点属性



/* *************************************************************************************** *
 *                                 visual modeling panel actions                           *
 * *************************************************************************************** */
export const SHOW_PARA_WINDOW = "showParaWindow";
export const SHOW_ENV_WINDOW = "showEnvWindow";
export const SHOW_DATA_WINDOW = 'showDataWindow';
export const SHOW_CHECK_WINDOW = 'showCheckWindow';//add by yrx. 20210205
export const CHANGE_GRAPH_MANAGER='changeGraphManager';
export const INIT_TASK_INPUT_DATA='initTaskInputData';
export const INIT_TASK_Method='initTaskMethod';
export const INIT_METHOD_DOMAIN='initMethodDomain';//add by yrx. 20200801
export const HEADER_TITLE='headerTitle';//add by yrx. 20200818
export const TRANSFER_TITLE='transferTitle';
export const GET_DATA_URL='getDataURL';
export const UPDATE_SELECTED_ITEM='updateSelectedItem';
export const CLEAR_SELECTED_ITEM='clearSelectedItem';
export const CURRENT_ELEMENT_NAME='currentElementName';
export const IS_SINGLE_SELECT_TYPE='isSingleSelectType';
export const SELECT_COVARIATE='selectCovariate';
export const FINISH_COVARIATE='finishCovariate';


/* *************************************************************************************** *
 *                                 upload shape file                           *
 * *************************************************************************************** */
export const SHOW_SHAPE_WINDOW = "showShapeWindow";
export const SHOW_UPLOAD_SHAPE_WINDOW = "showUploadShapeWindow";

/* *************************************************************************************** *
 *                                 show project detail                           *
 * *************************************************************************************** */
export const SHOW_PROJECT_ID = "projectId";

/* *************************************************************************************** *
 *                                 show seims model                           *
 * *************************************************************************************** */
export const SHOW_SEIMS_MODEL = "showSeimsModel";
export const SHOW_SEIMS_MANAGE = "showSeimsManage";
export const SHOW_MODEL_DETAIL = "showModelDetail";
export const SEIMS_MODEL_ID = "seimsModelId";

/* *************************************************************************************** *
 *                                 save&open model                     *
 * *************************************************************************************** */
export const SAVED_MODEL_ID = "savedModelId";
export const SAVED_MODEL_DOMAIN = 'savedModelDomain';//add by wej. 20210425
export const SAVED_STUDY_AREA = 'savedStudyArea';//add by wej. 20210425

