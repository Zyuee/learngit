/**
 * 使用常量替代 mutation 事件类型
 * 这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让代码合作者对整个 app 包含的 mutation 一目了然
 * @date 2017.3.30
 * @author houzhiwei
 * @see https://vuex.vuejs.org/zh-cn/mutations.html
 */

/* ********************************************************************************** *
 *                                   Map Mutations                                    *
 * ********************************************************************************** */

// 初始化、更新地图对象
export const INIT_MAP = 'INIT_MAP';
export const UPDATE_MAP = 'UPDATE_MAP';
// 地图控件
export const ADD_MAP_CONTROL = 'ADD_MAP_CONTROL';
export const REMOVE_MAP_CONTROL = 'REMOVE_MAP_CONTROL';
// 浏览器地理定位位置
export const INIT_GEOLOCATION = 'INIT_GEOLOCATION';
// 添加/移除地图交互
export const ADD_INTERACTION = 'ADD_INTERACTION';
export const REMOVE_INTERACTION = 'REMOVE_INTERACTION';
// add map layer
export const ADD_LAYER = 'ADD_LAYER';
export const ADD_OVERLAY = 'ADD_OVERLAY';
//设置Popup图层，用于显示查询信息
export const ADD_POPUP_LAYER = 'ADD_POPUP_LAYER';
//设置图例控件，用于显示图例
export const UPDATE_CURRENT_LEGENT_NAME = 'UPDATE_CURRENT_LEGENT_NAME';
export const UPDATE_CURRENT_LEGENT_URL = 'UPDATE_CURRENT_LEGENT_URL';

//select mapping area or mapping location
export const SELECT_MAPPING_AREA ="SELECT_MAPPING_AREA";
// select study area layer
export const STUDY_AREA_LAYERS = "STUDY_AREA_LAYERS";

/* ********************************************************************************** *
 *                                  Show Widgets Mutations                            *
 * ********************************************************************************** */

// 是否显示信息卡片
export const SHOW_USER_PROFILE = 'SHOW_USER_PROFILE';

export const SHOW_GROUP = 'SHOW_GROUP';
export const SHOW_GROUP_MEMBER = 'SHOW_GROUP_MEMBER';
export const SHOW_GROUP_MEMBER_GROUP_ID = 'groupId';
export const SHOW_GROUP_MEMBER_GROUP_NAME = 'groupName';
export const SHOW_GROUP_MEMBER_MY_ROLE = "myRole";

export const SHOW_PROJECTS = 'SHOW_PROJECTS';
export const SHOW_PROJECT_DETAIL_ID = 'SHOW_PROJECT_DETAIL_ID';

export const SHOW_MODELS = 'SHOW_MODELS';
export const SHOW_MODEL_BUILDING = 'SHOW_MODEL_BUILDING';

/* ********************************************************************************** *
 *                               Show DataSet & Data Mutations                        *
 * ********************************************************************************** */

export const SHOW_DATASETS = 'SHOW_DATASETS';
export const SHOW_DATASET_DETAIL = 'SHOW_DATASET_DETAIL';
export const SHOW_DATASET_DETAIL_ID = "datasetId";
export const DATASET_REFRESH = 'DATASET_REFRESH';
export const LAYER_REFRESH = 'LAYER_REFRESH';
export const SHOW_LAYER_ID = 'SHOW_LAYER_ID';
export const SELECT_SAMPLE_PROPERTY = 'SELECT_SAMPLE_PROPERTY';//用于记录选择的样点表格的id号，20201104，yrx

/* ********************************************************************************** *
 *                            Show windows for visual modeling                        *
 * ********************************************************************************** */

export const SHOW_PARA_WINDOW='SHOW_PARA_WINDOW';
export const SHOW_ENV_WINDOW='SHOW_ENV_WINDOW';
export const SHOW_DATA_WINDOW='SHOW_DATA_WINDOW';
export const SHOW_CHECK_WINDOW='SHOW_CHECK_WINDOW';
export const CHANGE_GRAPH_MANAGER='CHANGE_GRAPH_MANAGER';
export const INIT_TASK_INPUT_DATA='INIT_TASK_INPUT_DATA';
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
   *                                 upload shape file                                       *
   * *************************************************************************************** */

export const SHOW_SHAPE_WINDOW = "SHOW_SHAPE_WINDOW";
export const SHOW_UPLOAD_SHAPE_WINDOW = "SHOW_UPLOAD_SHAPE_WINDOW";

/* *************************************************************************************** *
 *                                 show project detail                                     *
 * *************************************************************************************** */

export const SHOW_PROJECT_DETAIL = "SHOW_PROJECT_DETAIL";
export const SHOW_PROJECT_ID = "SHOW_PROJECT_ID";
export const DO_REFRESH_PROJECTS = "DO_REFRESH_PROJECTS";
export const CHANGE_RUN_MODEL_FINISHED = "CHANGE_RUN_MODEL_FINISHED";

/* *************************************************************************************** *
 *                                 show seims model                                        *
 * *************************************************************************************** */
export const SHOW_SEIMS_MODEL = "SHOW_SEIMS_MODEL";
export const SHOW_SEIMS_MANAGE = "SHOW_SEIMS_MANAGE";
export const SHOW_MODEL_DETAIL = "SHOW_MODEL_DETAIL";
export const SEIMS_MODEL_ID = "SEIMS_MODEL_ID";

/* *************************************************************************************** *
 *                                 save&open model                                        *
 * *************************************************************************************** */
export const SAVED_MODEL_ID = "savedModelId";
export const SAVED_MODEL_DOMAIN='savedModelDomain';
export const SAVED_STUDY_AREA='savedStudyArea';

