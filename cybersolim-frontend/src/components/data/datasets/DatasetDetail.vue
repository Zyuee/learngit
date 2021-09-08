<template>
  <div>
    <j-panel :options="panelOptions" :show="show">
      <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
      <Alert show-icon closable style="margin-top:38px;margin-bottom:-40px">
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        Click button "Edit" above to edit details.
      </Alert>
      <Form :model="dataSet" label-position="right" :label-width="88"
            class="data-details">
        <Row>
          <Col span="7">
            <Form-item label="Name">
              <Input v-model="dataSet.datasetName" :readonly="isReadonly"
                     :class="{'readonly-input':isReadonly}"></Input>
            </Form-item>
          </Col>
          <Col span="7">
            <Form-item label="Creator">
              <Input readonly v-model="dataSet.creator"
                     class="readonly-input"></Input>
            </Form-item>
          </Col>
          <Col span="8">
            <Form-item label="Create Time" :label-width="100">
              <Input readonly v-model="dataSet.createTime"
                     class="readonly-input"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Form-item label="Description">
            <Input type="textarea" :rows="1"
                   v-model="dataSet.datasetDescription" :readonly="isReadonly"
                   :class="{'readonly-input':isReadonly}"></Input>
          </Form-item>
        </Row>
      </Form>
      <div class="data-detail-table">
        <Table size="small" border highlight-row :data="tblData" :columns="cols"
               height="200">
        </Table>
        <!--<div class="table-page">-->
        <!--<div style="float: right;">-->
        <!--<Page :total="rows" :current="currentPage" @on-change="changePage"></Page>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </j-panel>
    <!--  普通上传  -->
    <!--        <data-upload :show-upload="showUpload" @close="showUpload=false"></data-upload>-->
    <!--  分块上传  -->
    <upload-data :show-upload="showUpload" @close="showUpload=false"
                 @refresh="refresh"></upload-data>
    <upload-sample :show-upload="showUploadSample"
                   @close="showUploadSample=false"
                   @refresh="refresh"></upload-sample>
    <data-share :show="shareDataShow" :data-id="this.selectedShareData.id" :data-name="this.selectedShareData.name" data-type="file" :file-type-id="this.selectedShareData.fileTypeId" @close="closeSharePanel"></data-share>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import JPanel from '@/components/widgets/JSPanel'
  import VueToolbar from '@/components/widgets/toolbar/Toolbar'
  import {vIziToast} from '@/js/notify/v-iziToast'
  import * as actionTypes from '../../../store/action-types'
  // import DataUpload from './DataUpload'
  import UploadData from './UploadData'
  import UploadSample from "./UploadSample";
  import expandRow from './table-expand.vue'
  import {modelingConst} from '../../constVariable'
  import {ViewAnimate} from '../../map/js/view-animate.js'
  import mapLayers from '../../map/js/showLayers.js'
  import '@/js/filters.js';
  import DataShare from "./ShareData";

  export default {
    name: 'dataset-detail',
    data() {
      return {
        panelOptions: {
          headerTitle: 'DataSet Details',
          //headerControls: {maximize: 'remove'},
          theme: '#663399',//'#339966',//'primary',
          contentSize: {
            width: 768,
            height: 400
          },
          onclosed: this.closeThis,
          onwindowresize: true,
          resizeit: {handles: 's,n,e,w', minWidth: 600, maxWidth: 1000}
        },
        dataSet: {},
        toolbar: [
          {
            title: 'upload spatial data',
            click: this.uploadData,
            icon: 'md-cloud-upload',
            size: 17,
            text: 'Upload Spatial'
          }, {
            title: 'upload tabular data such as samples/observations/look-ups',
            click: this.uploadSample,
            icon: 'md-cloud-upload',
            size: 17,
            text: 'Upload Tabular Data'
          }, {
            title: 'edit data-set detail',
            click: this.editDetail,
            icon: 'md-create',
            size: 17,
            text: 'Edit'
          }, {
            title: 'save edited data-set detail',
            click: this.saveChange,
            icon: 'md-cloud-download',
            size: 17,
            text: 'Save'
          }, {
            title: 'refresh dataset detail',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }],
        tblData: [],
        cols: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: 'name',
            key: 'layerName',
            width: 130,
            sortable: true,
            resizable: true,
          }, {
            title: 'semantic',
            key: 'layerSemantic',
            width: 120
          },
          {
            title: 'size',
            width: 120,
            key: 'layerSize'
          },
          {
            title: 'format',
            width: 150,
            key: 'layerFormat'
          }, {
            title: 'Operations',
            key: 'action',
            width: 240,
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'earth',
                    //data:params.row
                  },
                  on: {
                    click: () => {
                      this.operateLayer(params.row);
                    }
                  }
                }, params.row.map),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'trash-a',
                    disabled: !params.row.deletePermitted
                  },
                  on: {
                    click: () => {
                      this.showSharePanel();
                      console.log(params.row)
                      this.shareData.id=params.row.dataLayerId;
                      this.shareData.name=params.row.layerName;
                      this.shareData.fileTypeId=params.row.fileTypeId
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
                      this.deleteDataLayer(params.row);
                    }
                  }
                }, 'Delete'),
              ])
            }
          }],
        rows: 0, // 总数据量
        currentPage: 1, //当前页数
        isReadonly: true,
        showUpload: false,
        showUploadSample: false,
        shareDataShow: false,
        shareData:{
          id:0,
          name:'',
          fileTypId:0,
        },
      }
    },
    components: {JPanel, VueToolbar, UploadData, UploadSample, expandRow, DataShare},
    // components: {JPanel, VueToolbar, DataUpload, expandRow},
    methods: {
      closeThis() {
        //this.show = false;//不能在这里对计算属性直接赋值，除非有setter方法
        this.$emit('close'); // 交给上一级处理
        this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL, false)
      },
      async showLayer(row) {
        if (row.dataType === "Raster") {
          let mapFileRootResp = await this.axios.post("./map/create?relativeFilePath=" + row.filePath);
          let mapFileRoot = mapFileRootResp.data.data;
          let layerName = row.filePath.split('.')[0];
          let epsgCode = row.layerProjection;
          let layerCenter = [(parseFloat(row.extentLeft) + parseFloat(row.extentRight)) / 2,
            (parseFloat(row.extentDown) + parseFloat(row.extentTop)) / 2];
          let map = mapLayers.loadMapServerWMS(this.baseMap, layerName, mapFileRoot);
          this.$store.dispatch('initMap', map);
          let proj4Def = await mapLayers.findProj4Def(epsgCode);
          mapLayers.layerOrientation(map, layerCenter, epsgCode, proj4Def);
        }
        if (row.dataType === 'Vector') {
          let layerName = row.filePath.split('.')[0];
          let map = mapLayers.loadMapServerWFS(this.baseMap, row.mapUrl, layerName);
          this.$store.dispatch('initMap', map);
        }
        if (row.dataType === 'Sample') {
          let samplesResp = await this.axios.get('/dataLayer/findSamples?layerId=' + row.dataLayerId);
          let samples = samplesResp.data.data;
          let name = samplesResp.data.msg.split(';')[0].split('.')[0];
          let srid = samplesResp.data.msg.split(';')[1];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, name);
          let map = mapLayers.showSamples(mapPre, samples, name, srid);
          this.$store.dispatch('initMap', map);
        }
      },
      showSharePanel(){
        this.shareDataShow = true;//创建项目的jspanel
      },
      closeSharePanel(){
        this.shareDataShow = false;//创建项目的jspanel
      },

      closeLayer(row) {
        let layerName = row.filePath.split('.')[0];
        if (layerName == undefined || layerName == '') layerName = row.layerName.split('.')[0];
        console.log(layerName);
        let map = mapLayers.closeMapLayer(this.baseMap, layerName);
        this.$store.dispatch('initMap', map);
      },
      operateLayer(row) {
        if (row.map === 'show') {
          this.showLayer(row);
          row.map = 'close';
        } else {
          this.closeLayer(row);
          row.map = 'show'
        }
      },
      changePage() {
      },
      deleteDataLayer(row) {
        let layerId = row.dataLayerId;
        let deleteUrl = (row.dataType === "Sample") ? '/delete/sample' : '/delete/raster';
        this.axios({
          url: deleteUrl,
          method: 'post',
          params: {id: layerId}
        }).then(response => {
          if (response.data.msg === 'success') {
            vIziToast.success('delete successfully');
            this.showDataSetlayerInfo();
          } else {
            vIziToast.error('delete failure');
          }
        })
      },
      editDetail() {
        this.isReadonly = false
      },
      saveChange() {
        if (this.isReadonly) {
          vIziToast.warning('Nothing to save. click "Edit" first to edit detail!', 5000)
        } else {
          this.axios({
            url: '/dataSet/update',
            method: 'post',
            data: this.dataSet,
            //config:config
          }).then((response) => {
            if (response.data.msg === 'success') {
              vIziToast.info('update successfully');
              this.showDataSetInfo();
            } else {
              vIziToast.error('update failure')
            }
          })
        }
      },
      refresh() {
        this.showDataSetInfo();
        this.showDataSetlayerInfo();
        vIziToast.success('Refreshed', 2000)
      },
      uploadData() {
        this.showUpload = true
      },
      uploadSample() {
        this.showUploadSample = true;
      },
      showDataSetInfo() {
        this.axios({
          url: '/dataSet/findDatasetBySetID',
          method: 'get',
          params: {dataSetId: this.dataSetId}
        }).then(response => {
          if (response.data.data) {
            this.dataSet = response.data.data;
          } else {
            console.error("response data is null");
          }
        }).catch(err => {
          console.log(err)
        });
      },
      showDataSetlayerInfo() {
        this.axios({
          url: '/dataSet/findDatasetlayers',
          method: 'get',
          params: {dataSetId: this.dataSetId}
        }).then(response => {
          let data = response.data.data;
          //需要从showlayer获取当前显示的图层
          let layers = this.baseMap.getLayers().getArray();
          let layersList = [];
          for (let j = 0; j < layers.length; j++) {
            if(layers[j].get('name') !== undefined && layers[j].get('visible')){ // 收集已经加载且显示的图层
              let count = layers[j].get('name').split('/').length;
              layersList.push(layers[j].get('name').split('/')[count-1]);
            }
          }
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (layersList.indexOf(data[i].layerName) == -1){//若没有在现有显示的图层中，则赋予show的标志
                data[i].map = 'show';
              }else {
                data[i].map = 'close';
              }
            }
            this.tblData = data;
          } else {
            console.error("response data is null");
          }
        })
      }
    },
    updated() {
      //console.log("b");
    },
    watch: {
      layerRefresh: function () {
        this.showDataSetlayerInfo();
      },
      detailShow: function () {
        this.showDataSetInfo();
        this.showDataSetlayerInfo();
      }
    },
    computed: {
      show() {
        return this.detailShow
      },
      ...mapState(
        {
          dataSetId: state => state.DataState.datasetId,
          layerRefresh: state => state.DataState.dataSetLayerRefresh,
          baseMap: state => state.basemap
        }
      ),
      selectedShareData: function (){
        return this.shareData;
      }
    },
    props: {
      //控制面板显示
      detailShow: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/data-table.scss";

  .data-details {
    margin-top: 45px;
    padding-right: 10px;
    border-bottom: 0.01px solid rgba(153, 153, 153, 0.38);
  }

  .data-detail-table {
    margin: 5px;
  }

  /*hover 及 focus 时不改变样式*/

  $border: #d7dde4;
  .readonly-input {
    input {
      &:hover {
        border-color: $border;
      }

      &:focus {
        border-color: $border;
        box-shadow: none;
      }
    }
  }

  .data-title {
    display: inline-block;
    margin-left: 3px;
    color: #5ea7f8;
  }
</style>
