<template>
  <div>
    <!--new dataset-->
    <dataset-create :createShow="creatorShow" @close="closeCreator"></dataset-create>
    <!--datasets table-->
    <j-panel :options="panelOptions" :show="show" class="data-table-panel">
      <Tabs value="Datasets">
        <TabPane label="Datasets" name="Datasets" class="ivu-tabs-tab-active">
          <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
            <div class="data-table">
              <Table :data="tableData" size="small" :columns="tableColumns" stripe border @on-select="tblSelect"
                     @on-select-all="tblSelectAll" no-data-text="No-Data" height="340"></Table>
            </div>
        </TabPane>
        <TabPane label="Subscribed Files" name="SubscribedFiles">
          <Table :data="subscribedFiles" size="small" :columns="subscribedFileColumns" stripe border @on-select="tblSelect"
                 @on-select-all="tblSelectAll" no-data-text="No-Data" height="340"></Table>
        </TabPane>
      </Tabs>

    </j-panel>
    <!--delete confirm-->
    <delete-confirm :del-modal="delModal" :deleting="deleting" @yes="deleteDatasets"
                    @cancel="delModal=false"></delete-confirm>

    <data-share :show="shareDatasetShow" :data-id="this.selectedShareDataset.id" :data-name="this.selectedShareDataset.name" data-type="dataset" @close="closeSharePanel"></data-share>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '@/store/action-types'
  import { vIziToast } from '@/js/notify/v-iziToast'
  import JPanel from '../../widgets/JSPanel'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import DatasetCreate from './DatasetCreate'
  import DeleteConfirm  from '../../widgets/modals/Delete-Confirm'
  import DatasetDetail from './DatasetDetail'
  import operateLayer from './DatasetDetail'
  import {modelingConst} from '../../constVariable'
  import permission from "./js/permission";
  import axios from "axios";
  import DataShare from "./ShareData";
  export default {
    name: 'datasets-table',
    data(){
      return {
        tableData: [],
        subscribedFiles:[],
        tableColumns: [
          {
            type: 'selection',
            align: 'center',
            width: 30,
            className: 'table-col'
          }, {
            title: 'Name',
            key: 'datasetName',
            sortable: true,
            width: 120
          }, {
            title: 'Date',
            key: 'createTime',
            sortable: true,
            width: 160
          }, {
            title: 'Creator',
            key: 'creator',
            sortable: true,
            width: 100
          }, {
            title: 'Description',
            key: 'datasetDescription',
            width: 150
          }, {
            title: 'Operation',
            key: 'action',
            width: 270,
            align: 'center',
            render: ( h, params ) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'eye'
                  },
                  on: {
                    click: () => {
                      this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL_ID,params.row.datasetId);
                      this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL,true);
                    }
                  }
                }, 'Details'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'share',
                    disabled: !params.row.deletePermitted
                  },
                  on: {
                    click: () => {
                      this.shareDataset.id=params.row.datasetId;
                      this.shareDataset.name=params.row.datasetName;
                      this.showSharePanel();
                    }
                  }
                }, 'Share'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-a',
                    disabled: !params.row.deletePermitted
                  },
                  on: {
                    click: () => {
                      let ids = [];
                      ids.push(params.row.datasetId)
                      this.deleteDataSet(ids);
                    }
                  }
                }, 'Delete'),
              ]);
            }
          }],
        subscribedFileColumns: [{
            title: 'File Name',
            key: 'fileName',
            width: 150
          }, {
            title: 'Type',
            key: 'fileType',
            width: 80
          }, {
            title: 'From',
            key: 'fromType',
            width: 80
          }, {
            title: 'Name',
            key: 'fromName',
            width: 150
          }, {
            title: 'Operation',
            key: 'action',
            width: 150,
            align: 'center',
            render: ( h, params ) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-a',
                    disabled: params.row.groupId!==0 && params.row.isDeletePermitted===false
                  },
                  on: {
                    click: () => {
                      this.unsubscribeFile(params.row.shareId);
                    }
                  }
                }, 'Unsubscribe'),
              ]);
            }
          }],
        // 项目管理面板
        panelOptions: {
          id: 'datasets_table',
          theme: 'primary',//"#0074D9",
          headerTitle: 'Manage All Data',
          headerControls: {maximize: 'remove'},
          draggable: true,
          contentSize: {
            width: 870,
            height: 470
          },
          onclosed: this.closeThis,
          resizeit:{handles: 'e,w',minWidth: 600,maxWidth: 1000}
        },
        creatorShow: false, // 显示创建面板
        detailShow: false, // 显示创建面板
        shareDatasetShow: false, //显示分享数据集面板
        shareFileShow: false,
        selectedRows: [], // 选择的行
        toolbar: [
          {
            title:'refresh',
            click:this.refresh,
            icon:'md-refresh',
            text:'refresh'
          }
          ],
        delModal: false,
        deleting: false,
        dataSetId: 999999,
        shareDataset:{
          id:0,
          name:'',
        }

      }
    },
    components: {DataShare, JPanel, VueToolbar, DatasetCreate, DeleteConfirm, DatasetDetail },
    methods: {
      loadDataSets(){
        this.axios({
          url:'/dataSet/listUserDataSets',
          method:'GET',
        }).then(response=>{
          this.tableData = response.data.data;
        })
        this.axios({
          url:'/dataSet/listSubscribedFiles',
          method:'GET',
        }).then(response=>{
          this.subscribedFiles = response.data.data;
          for(let item of this.subscribedFiles){
            item["fromType"] = item.groupId===0?"user" : "group";
            item["fromName"] = item.groupId===0?item.userName:item.groupName;
          }
        })
      },
      refresh(){
        this.loadDataSets();
        vIziToast.success('refresh',1000,'center');
      },
      tblSelect( selection, row ){
        this.selectedRows = selection;
      },
      tblSelectAll: selection => {
        this.selectedRows = selection;
      },
      changePage(){

      },
      closeCreator(){
        this.creatorShow = false;
      },
      closeThis(){
        this.$store.dispatch(actionTypes.SHOW_DATASETS_TABLE, false);
      },
      showCreatePanel(){
        this.creatorShow = true;//创建项目的jspanel
      },
      showSharePanel(){
        this.shareDatasetShow = true;//创建项目的jspanele
      },
      closeSharePanel(){
        this.shareDatasetShow = false;//创建项目的jspanel
      },
      delConfirm(){
        console.log(this.selectedRows);
        this.delModal = true;
      },
      deleteDatasets(){
        let dataSetIds = [];
        for (let i = 0; i < this.selectedRows.length; i++){
          dataSetIds.push(this.selectedRows[i][modelingConst.DATASETID]);
        }
        this.deleteDataSet(dataSetIds);
        this.delModal = false;
      },
      deleteDataSet(ids){
        this.axios({
          url:'/delete/dataset?dataSetIds=' + ids,
          method:'post',

        }).then(response => {
          if (response.data.msg === 'success'){
            vIziToast.success('delete successfully',1000,'center');
            this.loadDataSets();
            this.$store.dispatch(actionTypes.DATASET_REFRESH);
          }
        })
      },
      unsubscribeFile(shareId){
        this.axios({
          url:'/share/unsubscribeFile?id=' + shareId,
          method:'delete',
        }).then(response => {
          console.log(response)
          if (response.data!==null&&response.data.status==='OK'){
            vIziToast.success('unsubscribe successfully',2000,'center');
            this.loadDataSets();
            this.$store.dispatch(actionTypes.DATASET_REFRESH);
          }else{
            vIziToast.error(response.data.status,2000,'center');
          }
        })
      },
      unsubscribeDataset(shareId){
        this.axios({
          url:'/share/unsubscribeDataset?id=' + shareId,
          method:'delete',
        }).then(response => {
          if (response.data.data!==null&&response.data.status==='OK'){
            vIziToast.success('unsubscribe successfully',2000,'center');
            this.loadDataSets();
            this.$store.dispatch(actionTypes.DATASET_REFRESH);
          }
        })
      }
    },
    watch:{
      show:function () {
          if (this.show){
            this.loadDataSets();
          }
      },
      dataRefresh:function () {
        this.loadDataSets();
      },
    },
    computed: {
      ...mapState({
        show: state => state.DataState.showDataSets,
        // show: state =>state.WidgetsShowState.showShapeWindow,
        dataRefresh: state => state.DataState.treeRefresh
      }),
      selectedShareDataset:function (){
        return this.shareDataset;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-table.scss";
</style>
