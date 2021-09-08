<template>
  <j-panel :options="panelOptions" :show="show">
    <Row style="display: block; margin-bottom: 0px">
      <div>
        <Col span="7">
          <Scroll height="100%">
            <div style="width: 450px;height: 557px">
              <vue-tree class="modelBuilding-tree-content" :option="theMenu" ></vue-tree>
            </div>
            <div style="position: absolute; bottom: 10px; display: flex; flex-flow: column nowrap;">
                <div>
                  <div class="ellipse-unconfigured"></div><div class="legend-text">unconfigured data</div>
                </div>
                <div>
                  <div class="ellipse-configured"></div><div class="legend-text">configured data</div>
                </div>
              <div>
                <div class="ellipse-selected"></div><div class="legend-text">selected data</div>
              </div>
              <div>
                <div class="rectangle-unconfigured"></div><div class="legend-text">unsatisfied task</div>
              </div>
              <div>
                <div class="rectangle-configured"></div><div class="legend-text">satisfied task</div>
              </div>
            </div>
          </Scroll>
        </Col>
        <Col span="17">
          <row>
            <div style="height: 27px">
              <button-group id="buttons" width="2000" height="27">
                <button style="width:30px;margin-left: 0px;margin-top: 1px"
                        title="save"
                        @click="saveModel">
                  <Icon type="iconfont egc-iconsave" size="27" />
                </button>
                <button style="width:30px;margin-left: 5px; margin-top: 1px"
                        title="save as"
                        @click="saveAsModel">
                  <Icon type="iconfont egc-iconsaveas" size="26"/>
                </button>
              </button-group>
            </div>
          </row>
          <row>
<!--            <div >-->
<!--              <Scroll  height="100%">-->
                <div id="modelScroll" style="height: 557px; overflow: auto">
                  <canvas id="modelCanvas" width="2000" height="2000"
                          @mousedown="canvasDown($event)"
                          @mouseup="canvasUp($event)"
                          @mousemove="canvasMove($event)">
                  </canvas>
                </div>
<!--              </Scroll>-->
<!--            </div>-->
          </row>
        </Col>
      </div>
    </Row>
    <task-menu :target="contextMenuTarget"
               :manager="graphManager"
               :rMenuPosition="mousePosition"
               :rMouseDownType="mouseDownType"></task-menu>
    <semantic-select :currentTask="mouseDownType"></semantic-select>
    <parameter-set :currentTask="mouseDownType"></parameter-set>
    <data-select :currentData="mouseDownType"></data-select>
    <workflow-check :currentData="mouseDownType"></workflow-check>
    <Modal
      v-model="inputNameModal"
      class-name="modal-inputName"
      :closable="false"
      @on-ok="ok"
      @on-cancel="inputNameModal=false">
      <div slot="header" >
        <div class="title-custom">
          <span>input model name</span>
        </div>
      </div>
      <input ref="inputName"
             placeholder="input the name of saving model"
             style="width: 100%; border-color: #ffffff"
      />
    </Modal>
  </j-panel>
</template>

<script>

  import {mapState} from 'vuex'
  import JPanel from '../widgets/JSPanel'
  import {GetQueryString} from './model/tesss'
  import GraphManager from './model/GraphManager'
  import VueTree from './visualtree/AlgorithmTree'
  import myBus from './myBus'
  import Knowledge from '../knowledge/Knowledge_new'
  import SemanticSelect from './VMWindows/SemanticSelect.vue'
  import TaskMenu from './menu/RightTaskMenu.vue'
  import DataMenu from './menu/RightDataMenu.vue'
  import * as actionTypes from '../../store/action-types'
  import ParameterSet from './VMWindows/ParameterSet.vue'
  import DataSelect from './VMWindows/DataSelect.vue'
  import WorkflowCheck from './VMWindows/WorkflowCheck.vue'
  import Sidebar from '../widgets/Sidebar.vue'

  export default {
    name: 'model-building',
    data() {
      return {
        panelOptions: {
          id: 'models_table',
          headerTitle: 'Manage All Models',
          contentSize: {
//            width: function() { console.log(window.innerHeight);return Math.min(1000, window.innerWidth*0.8);},
//            height: function() { return Math.min(500, window.innerHeight*0.7);}
            width: 1300,
            height: 600
          },
          headerControls: {
             maximize: "remove",
          },
          // resizeit:{disable:true},
          resizeit: {handles: "e", minHeight: 500, minWidth: 900},
          onclosed: this.closeThis,
          onwindowresize: true,
        },
        creatorShow: false, // 显示创建面板
        theMenu: {},
        canvasContext: {},
        canvas: {},
//        methodName:"",
        graphManager: null,
        contextMenuTarget: '',
        mousePosition: {},
        mouseDownType: '',
        inputNameModal: false,

      }
    },
    components: {
      JPanel,
      VueTree,
      SemanticSelect,
      TaskMenu,
      DataMenu,
      ParameterSet,
      DataSelect,
      WorkflowCheck,
    },
    computed: {
      ...mapState({
        show: state => state.WidgetsShowState.showModelBuilding,
        // show: state => state.WidgetsShowState.showModels,
        methodDomain: state => state.ModelState.methodDomain,//add by yrx. 20200801
        methodName: state => state.ModelState.methodName,//初始化
//        savedModelDomain: state => state.ModelState.savedModelDomain,
        studyArea: state => state.ModelState.savedStudyArea
      })
    },
    mounted() {
      this.contextMenuTarget = document.querySelector("#modelCanvas");
      this.canvas = document.querySelector('#modelCanvas');
      this.axios.get('./algorithm/listAllService', {
        params: {algorithmDomain: this.methodDomain}//add by yrx. 20200801
      }).then((response) => {
        // console.log(response.data);
        this.theMenu = response.data
      }).catch((err) => {
        console.log(err);
      });
      //console.log("mounted");
      this.showModel(this.methodName);//canvas绘制入口
      $("#modelScroll").scrollTop(1500);
    },
    created() {
      myBus.$on('my-algorithm', name => {
        //console.log(name);
        this.$store.dispatch(actionTypes.CLEAR_SELECTED_ITEM);//重新选择算法的时候要先清空之前的选择
        this.$store.dispatch(actionTypes.INIT_TASK_Method, name);
        this.showModel(this.methodName);
      });
    },
    updated() {
//      this.contextMenuTarget = document.querySelector("#modelCanvas");
//      this.canvas = document.querySelector('#modelCanvas')
//      this.canvasContext = this.canvas.getContext('2d')
//      this.showModel(this.methodName);
      //console.log("c");
    },

//    watch:{
//      methodName:function (val) {
//          this.showModel(val);
//        //this.testCanvas("modelCanvas")
//      },
//      show:function () {
//        this.setRightMenuTarget();
//      },
//    },
    methods: {
      canvasDown(e) {
//         let graphModel = new GraphManager(this.canvas)
//         graphModel.onmousedown(e)
        if (this.graphManager !== null) {
          this.graphManager.onmousedown(e);
          this.mouseDownType = this.graphManager.getCurrent();// todo:因为数据选择视图和参数、环境变量视图都是用了这个数据，是否添加判断
          this.mousePosition = e;
        }
      },
      canvasUp(e) {
        if (this.graphManager !== null) {
          this.graphManager.onmouseup(e)
        }
      },
      canvasMove(e) {
        //let graphModel = new GraphManager(this.canvas)
        if (this.graphManager !== null) {
          this.graphManager.onmousemove(e)
        }
      },
      stopDefaultMenu(e) {
        e.preventDefault();
      },
      canvasInit() {
        let graphModel = new GraphManager(this.canvas);
        graphModel.init().then(function () {
          console.log("init successfully")
        })
      },
      copyMsg() {
      },
      closeThis() {
        this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, false);
        // this.$store.dispatch(actionTypes.SHOW_MODELS_TABLE, false);
        this.$store.dispatch(actionTypes.CLEAR_SELECTED_ITEM);
      },
      showModel(val) {
        let predictingTaskInputData = [];
        //console.log(this.canvas);
        this.graphManager = new GraphManager(this.canvas);//初始化一个canvas管理对象
        //console.log(this.canvas)
        this.graphManager.init(val).then(response => {
          predictingTaskInputData = response.inputData;
          //console.log(predictingTaskInputData);
          this.$store.dispatch(actionTypes.INIT_TASK_INPUT_DATA, predictingTaskInputData);
        });
        this.$store.dispatch(actionTypes.CHANGE_GRAPH_MANAGER, this.graphManager);
        this.graphManager.recordModelDomain(this.methodDomain);
        this.graphManager.recordModelArea(this.studyArea);
        //console.log(this.$store.state.ModelState.graphMangerState);
      },
      saveModel(){
        let inputModelName = null;
        let runModelId = 0;
        this.graphManager.saveBuildingModel(inputModelName, runModelId);
      },
      saveAsModel(){
        this.inputNameModal=true;
      },
      ok(){
        let inputModelName = this.$refs.inputName.value;
        let runModelId = 0;
        this.graphManager.saveBuildingModel(inputModelName, runModelId);
        this.inputNameModal=false;
      },
    }
  }
</script>

<style lang="scss">
  /*.layout {*/
  /*  border: 1px solid #d7dde4;*/
  /*  background: #f5f7f9;*/
  /*  position: relative;*/
  /*  !*height: 1px;*!*/
  /*  !*height: auto;*!*/
  /*  width: auto;*/
  /*  bottom: 0;*/
  /*}*/

  /*.layout-row {*/

  /*  height: auto;*/
  /*  bottom: 0;*/
  /*  !*position:relative;*!*/
  /*}*/

  /*.layout-menu-left {*/
  /*  !*background: #464c5b;*!*/
  /*  !*height: 598px;*!*/
  /*  bottom: 0;*/

  /*  !*overflow-y: scroll;*!*/
  /*  !*overflow: auto;*!*/
  /*  !*border:solid 1px green;*!*/
  /*  height: 100%;*/
  /*  !*position:relative;*!*/
  /*}*/

  /*.layout-content {*/
  /*  !*min-height: 600px;*!*/
  /*  !*min-height: 100%;*!*/
  /*  height: auto;*/
  /*  bottom: 0;*/
  /*  !*height: 100%;*!*/
  /*  !*overflow: auto;*!*/
  /*  !*overflow-x:scroll ;*!*/
  /*  !*overflow-y: auto;*!*/
  /*  background: #fff;*/
  /*  border-radius: 4px;*/
  /*  !*position:relative;*!*/
  /*}*/

  .modal-inputName {
    .ivu-modal-header {
      background-color: #2d8cf0;
    }
    .ivu-btn-text{
      border-color: #2d8cf0;
    }
    .title-custom {
    span {
      font-size: 22px;
      color: #ffffff;
      }
    }
  }
  $legendWidth: 50px;
  $legendHeigth: 30px;
  .ellipse{
    width: $legendWidth;
    height: $legendHeigth;
    margin: 5px;
    border-radius: 50% / 50%;
    float:left;
  }
  .ellipse-unconfigured{
    @extend .ellipse;
    background: #e2a896;
  }
  .ellipse-configured{
    @extend .ellipse;
    background: #9acd32;
  }
  .ellipse-selected{
    @extend .ellipse;
    background: #ff8c00;
  }
  .rectangle{
    width: $legendWidth ;
    height: $legendHeigth - 5px;
    margin: 5px;
    float:left;
  }
  .rectangle-unconfigured{
    @extend .rectangle;
    background: #B0E2FF;
  }
  .rectangle-configured{
    @extend .rectangle;
    background: #25dad4;
  }
  .legend-text{
    float: left;
    line-height: $legendHeigth+10px;
    margin-right: 10px;
  }

</style>
