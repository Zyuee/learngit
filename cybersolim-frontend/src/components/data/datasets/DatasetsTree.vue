<template>
  <div class="tree">
    <!--create data set panel-->
    <dataset-create :createShow="creatorShow"
                    @close="closeThis"></dataset-create>
    <!-- detail panel-->
    <dataset-detail :detailShow="detailShow"
                    @close="closeDetail"></dataset-detail>
    <!--all data set table-->
    <datasets-table></datasets-table>
    <vue-toolbar :items="toolbar"></vue-toolbar>
    <vue-tree class="tree-content" :option="datasets"
              :context-menus="contextMenus"
              :buttons="buttons" :loading="true"></vue-tree>
    <vue-tree class="tree-content" :option="subscribedDatasets"
              :context-menus="contextMenus"
              :buttons="buttons" :loading="true"></vue-tree>
    <vue-tree class="tree-content" :option="subscribedFiles"
              :context-menus="contextMenus"
              :buttons="buttons" :loading="true"></vue-tree>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import VueToolbar from '@/components/widgets/toolbar/Toolbar'
  import VueTree from '@/components/widgets/tree/Tree'
  import * as actionTypes from '@/store/action-types'
  import {vIziToast} from '@/js/notify/v-iziToast'
  import DatasetsTable from './DatasetsTable'
  import DatasetCreate from './DatasetCreate'
  import DatasetDetail from './DatasetDetail'
  import {modelingConst} from '../../constVariable'
  import mapLayers from '../../map/js/showLayers.js'
  //  这个列表不应该是按照是否有父节点来判断图标，而是必须按照是否是数据集来判断
  export default {
    name: 'datasets',
    data() {
      return {
        datasets: {},
        subscribedDatasets: {},
        subscribedFiles: {},
        creatorShow: false, // 显示 create project panel
        toolbar: [
          {
            title: 'create new dataset',
            click: this.showCreatePanel,
            icon: 'ios-add-circle',
            size: 17,
            text: 'New'
          }, {
            title: 'reload data',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }, {
            title: 'manage all datasets',
            click: this.showDataSetTable,
            icon: 'md-menu',
            size: 17,
            text: 'Manage All'
          }
        ],
        contextMenus: [{
          text: 'delete dataset',
          click: node => {
            if (node.isParent && node.parentId !== -1) {
              let ids = [];
              ids.push(node.id);
              this.deleteDataSet(ids);
            } else {
              vIziToast.info("just can delete data sets");
            }
          }
        }],
        buttons: [
          {
            key: 'detail',
            text: 'show detail',
            icon: 'md-grid',
            click: node => {
              if (this.detailShow) {
                vIziToast.info("close the opened dataSet Detail dialog first")
              } else {
                this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL, true);
                this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL_ID, node.id);
              }
            }
          }, {
            key: 'map',
            text: 'Show on map',
            icon: 'md-map',
            click: node => {
              this.showLayer(node.id, node.type);
              // this.showLayer(node.id, node.title);
            }
          }
        ],
        //dataSetId:null
      }
    },
    components: {
      VueToolbar, VueTree, DatasetCreate, DatasetsTable, DatasetDetail
    },
    mounted() {
      this.loadDataSetTree();
    },
    methods: {
      async loadDataSetTree() {
        await this.axios.get('./dataSet/listDatasetTree').then((response) => {
          this.datasets = response.data.data[0]
          this.subscribedDatasets=response.data.data[1]
          this.subscribedFiles=response.data.data[2]
        })
        let _this = this;
        setTimeout(function (){
          _this.$set(_this.datasets.root,"isOpen",true);
        },1000)
      },
      refresh() {
        this.loadDataSetTree();
        vIziToast.success('refreshed');
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
          title: 'Manage it in data grid',
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
      closeDetail() {
        this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL, false)
      },
      showDataSetTable() {
        this.$store.dispatch(actionTypes.SHOW_DATASETS_TABLE, true);
        //this.$store.dispatch(actionTypes.PROJECT_DETAIL_ID, node.id);
      },
      deleteDataSet(ids) {
        this.axios({
          url: '/delete/dataset?dataSetIds=' + ids,
          method: 'post'
        }).then(response => {
          if (response.data.msg === 'success') {
            vIziToast.success('delete successfully', 1000, 'center');
            this.loadDataSetTree();
          }
        })
      },
      async showLayer(id, semantic) {
        if (semantic === modelingConst.SAMPLESEMANTIC) {
          let samplesResp = await this.axios.get('/dataLayer/findSamples?layerId=' + id);
          let samples = samplesResp.data.data;
          let name = samplesResp.data.msg.split(';')[0].split('.')[0];
          let srid = samplesResp.data.msg.split(';')[1];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, name);
          let map = mapLayers.showSamples(mapPre, samples, name, srid);
          this.$store.dispatch('initMap', map);
        }else if (semantic === "Vector"){
          await mapLayers.loadVectorMap(id, this.baseMap, this);
        } else {
          await mapLayers.loadRasterMap(id, this.baseMap, this);
          /*let rasterResp = await this.axios.get("/dataLayer/findRaster?layerId=" + id);
          let rasterFile = rasterResp.data.data;
          let relativePath = rasterFile['rasterFilePath'];
          let top = rasterFile['boundaryUp'];
          let down = rasterFile['boundaryDown'];
          let left = rasterFile['boundaryLeft'];
          let right = rasterFile['boundaryRight'];
          let epsgCode = rasterFile['rasterAuthSrid'];
          let centerPoint = [(left + right) / 2, (top + down) / 2];
          let mapFileRootResp = await this.axios.post("./map/create?relativeFilePath=" + relativePath);
          //console.log(mapFileRootResp.data);
          let mapFileRoot = mapFileRootResp.data.data;
          let layerName = relativePath.split(".")[0];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, layerName);
          let map = mapLayers.loadMapServerWMS(mapPre, layerName, mapFileRoot);
          this.$store.dispatch('initMap', map);
          let proj4Def = await mapLayers.findProj4Def(epsgCode);
          mapLayers.layerOrientation(map, centerPoint, epsgCode, proj4Def);*/
        }
      },
    },
    watch: {
      dataRefresh: function () {
        this.loadDataSetTree();
      }
    },
    computed: {
      ...mapState({
        detailShow: state => state.DataState.showDataSetDetail,
        dataSetId: state => state.DataState.datasetId,
        dataRefresh: state => state.DataState.treeRefresh,
        baseMap: state => state.basemap
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-tree.scss";
</style>
