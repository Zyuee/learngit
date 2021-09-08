<template>
  <div class="tree">
    <!--create model panel-->
    <model-create slot="create" :createShow="creatorShow" @close="closeThis"></model-create>
    <!--all models table-->
    <lazy-render>
      <!--   manage all models, currently are seims models   -->
      <models-table :show-all-models="showAllModels" @close="closeAllModels"></models-table>
      <!--  model building panel    -->
      <model-building v-if="showModelBuildingPanel"></model-building>
      <vue-tree class="tree-content"
                :option="models"
                :buttons="buttons"
                :context-menus="contextMenus"
                ref="tree"
                :loading="true">
      </vue-tree>
      <Modal
        v-model="renameModal"
        class-name="modal-rename"
        :closable="false"
        @on-ok="ok"
        @on-cancel="renameModal=false">
        <div slot="header" >
          <div class="title-custom">
            <span>rename model</span>
          </div>
        </div>
        <input ref="inputName"
               placeholder="input new model name"
               style="width: 100%; border-color: #ffffff"
        />
      </Modal>
      <delete-confirm
        :del-modal="delModal"
        :closable="false"
        :deleting="deleteing"
        @yes="deleteModel"
        @cancel="delModal=false; deleteing=false">
      </delete-confirm>
    </lazy-render>
    <vue-toolbar :items="toolbar"></vue-toolbar>
<!--    <vue-tree class="tree-content" :option="models"></vue-tree>-->
    <!-- seims   -->
    <lazy-render>
      <ModelPanel v-if="showSeims"></ModelPanel>
    </lazy-render>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import VueTree from '../../widgets/tree/Tree'
  import * as actionTypes from '../../../store/action-types'
  import {vIziToast} from '../../../js/notify/v-iziToast'
  import ModelsTable from './ModelsTable'
  import ModelCreate from './ModelCreate'
  import ModelBuilding from '../../VisualModeling/ModelBuilding'
  import ModelPanel from "../../seims/ModelPanel";
  import axios from "axios";
  import GraphManager from '../../VisualModeling/model/GraphManager';
  import ModelState from "../../../store/modules/visualModeling";
  import Task from "../../VisualModeling/model/Task";
  import Data from "../../VisualModeling/model/Data";
  import Connection from "../../VisualModeling/model/Connection";
  import Parameter from "../../VisualModeling/model/Parameter";
  import DeleteConfirm  from '../../widgets/modals/Delete-Confirm'
  import store from "../../../store";

  export default {
    name: 'models',
    data() {
      return {
        models: {
          root: {
            name: 'Models', //显示
            id: 0,
            parentId: -1,
            title: 'Models', //提示
            children: [{
              name: 'Test model',
              title: 'Test',
              id: 1,
              children: [
                {
                  name: 'sub',
                  title: 'sub model',
                  id: 3,
                  buttons: [
                    {
                      text: 'Show on map',
                      icon: 'fa fa-table',
                      click: node => {
                        console.log(node); // 本结点
                        vIziToast.success(node.id);
                      }
                    }
                  ],
                  children: []
                }
              ]
            }]
          },
          showLoading: false
        },
        creatorShow: false, // 显示 create model panel
        toolbar: [
          // {
          //   title: 'create new model',
          //   click: this.showCreatePanel,
          //   icon: 'ios-add-circle',
          //   size: 17,
          //   text: 'New'
          // },
          {
            title: 'reload data',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }, {
            title: 'manage all models',
            click: this.showModelsTable,
            icon: 'md-menu',
            size: 17,
            text: 'Manage All'
          }
        ],
        buttons: [
          {
            key: 'openModel',
            text: 'Open model',
            icon: 'ios-build',
            click: node => {
             this.openModel(node.id);
            }
          }],
        contextMenus: [
          {
            text: 'rename',
            click:
              node => {
              if (node.name !== "root"){
                this.renameModal = true;
              }else{
                vIziToast.info('please select the correct model',1000,'center');
              }
            }
          },
          {
          text: 'delete',
          click: node => {
            if (node.name !== "root") {
              this.delModal = true;
            }else{
              vIziToast.info('please select the correct model',1000,'center');
            }
           }
          },
        ],
        showAllModels:false,
        renameModal: false,
        delModal:false,
        deleteing: false,
      }
    },
    components: {
      VueToolbar, VueTree, ModelCreate, ModelsTable, ModelBuilding, ModelPanel, DeleteConfirm
    },
    mounted() {
      this.loadModels();
    },
    methods: {
      async refresh() {
        await this.loadModels();
        vIziToast.success('models refreshed');
        this.$set(this.models.root,"isOpen",true);
      },
      loadModels(){
         this.axios.get('./model/listModels').then(( response ) => {
          if(response.data.root.children.length>0){
            this.models = response.data
          }
         let _this = this;
         setTimeout(function (){
           _this.$set(_this.models.root,"isOpen",true);
         },1000)
        })
      },
      /**
       * 详情按钮
       * @param { Function } clickFn click function
       * @returns {{title: string, icon: string, click: *}}
       */
      infoButton(clickFn) {
        return {
          title: 'Show details',
          icon: 'fa fa-info-circle',
          click: clickFn
        }
      },
      detailButton(clickFn) {
        return {
          title: 'Manage it in datagrid',
          icon: 'fa fa-table',
          click: clickFn
        }
      },
      showCreatePanel() {
        this.creatorShow = true;
      },
      closeThis() {
        this.creatorShow = false;
      },
      closeAllModels() {
        this.showAllModels = false;
      },
      showModelsTable() {
        this.$store.dispatch(actionTypes.SAVED_MODEL_ID, true);
      },
      showModelBuilding() {
        this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, true);
      },
      openModel(modelId){
        //clean the "MODEL_BUILDING" before opening
        this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, false);
        this.$store.dispatch(actionTypes.CLEAR_SELECTED_ITEM);
        this.axios({
          url: "/model/findModelInfoById",
          method: "get",
          params: {
            modelId: modelId
          }
        }).then(( response ) => {
          let modelInfo = response.data.data;
          let modelDomain = modelInfo.modelDomain;
          let modelArea = modelInfo.modelArea;
          let modelDetailsList = JSON.parse(modelInfo.modelDetails);
          //console.log(modelDetailsList);
          this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, true);
          this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, modelArea);
          this.$store.dispatch(actionTypes.INIT_METHOD_DOMAIN, modelDomain);
          this.$store.dispatch(actionTypes.INIT_TASK_Method, "");
          this.$nextTick(function (){
            let graphManger = this.$store.state.ModelState.graphMangerState;
            //console.log(graphManger);
            // this.drawModel(modelDetails, graphManger);
            graphManger.recordModelDomain(modelDomain);
            graphManger.recordModelArea(modelArea);
            graphManger.openBuildingModel(modelDetailsList);
          });
        })
      },
      deleteModel(){
        let modelId = this.$refs.tree.ctxNode.id;
        this.axios({
          url:'/delete/savedModel',
          method: "post",
          params: {
            modelId: modelId
          }
        }).then(response => {
          if (response.data.msg === 'success') {
            vIziToast.success('delete successfully', 1000, 'center');
            this.loadModels();
          }
          else {
            vIziToast.info('delete failed',1000,'center');
          }
        })
        this.delModal=false;
        this.deleteing=false;
      },
      renameModel(){
        let inputName = this.$refs.inputName.value;
        let modelId = this.$refs.tree.ctxNode.id;
        // console.log(inputName);
        // console.log(modelName);
        this.axios({
          url:'/model/renameModel',
          method: "post",
          params: {
            modelId: modelId,
            inputName: inputName
          }
        }).then(response => {
          if (response.data.msg === 'success') {
            vIziToast.success('rename successfully', 1000, 'center');
            this.loadModels();
          }
          else {
            vIziToast.info('rename failed',1000,'center');
          }
        })
      },
      // openModal(){
      //   this.renameModal = true;
      // },
      ok(){
        this.renameModel();
      }
    },

    computed: {
      ...mapState({
        showModelBuildingPanel: state => state.WidgetsShowState.showModelBuilding,
        showSeims: state => state.SeimsState.showSeimsModel,
        // graphManger: state => state.ModelState.graphMangerState
      })
    }
  }
</script>

<style lang="scss">
  @import "../scss/data-tree.scss";
  .modal-rename {
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
</style>
