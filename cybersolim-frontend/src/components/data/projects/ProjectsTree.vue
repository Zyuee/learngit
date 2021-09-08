<template>
  <div class="tree">
    <!--create project panel-->
    <project-create :createShow="creatorShow" @close="closeThis"></project-create>
    <project-detail v-if="show"></project-detail>
    <lazy-render>
      <vue-tree class="tree-content" :option="projects" :context-menus="contextMenus"
                :buttons="buttons" :loading="true"  ref="projectsTree" >
      </vue-tree>
    </lazy-render>
    <!--all projects data table-->
    <projects-table></projects-table>
    <vue-toolbar :items="toolbar"></vue-toolbar>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import VueTree from '../../widgets/tree/Tree'
  import * as actionTypes from '../../../store/action-types'
  import { vIziToast } from '../../../js/notify/v-iziToast'
  import ProjectsTable from './ProjectsTable'
  import ProjectCreate from './ProjectCreate'
  import ProjectDetail from './ProjectDetail'

  import mapLayers from '../../map/js/showLayers.js'
  import { modelingConst } from '../../constVariable'

  export default {
    name: 'projects',
    data() {
      return {
        projects: {root: {
          name: 'Projects', //显示
          id: 0,
          parentId:-1,
          expand: true,
          title: 'Projects', //提示
          children: [{
            name: 'Test project',
            title: 'Test',
            id: 1,
            expand: true,
            children: [
              {
                name: 'sub',
                title: 'sub project',
                id: 3,
                expand: true,
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
                children:[]
              }
            ]
          }]
        },
          showLoading: false},
        projectsOption: {},
        creatorShow: false, // 显示 create project panel
        toolbar: [
//            {
//          title: 'create new project',
//          click: this.showCreatePanel,
//          icon: 'ios-add-circle',
//          size: 17,
//          text: 'New'
//        },
          {
            title: 'reload data',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }, {
            title: 'manage all projects',
            click: this.showProjectTable,
            icon: 'md-menu',
            size: 17,
            text: 'Manage All'
          }
        ],
       /* buttons: [
          {
          key: 'detail',
          text: 'show detail',
          icon: 'fa fa-table',
          click: node => {
            if (this.detailShow) {
              vIziToast.info("close the opened dataSet Detail dialog first")
            }
            else {
              this.$store.dispatch(actionTypes.SHOW_PROJECT_DETAIL, true);
              this.$store.dispatch(actionTypes.SHOW_PROJECT_ID, node.id);
            }

          }
        },
          {
            key: 'map',
            text: 'Show on map',
            icon: 'fa fa-map',
            click: node => {
              this.showLayer(node, id, node.name, node.parentId);
            }
          }
        ],*/
        contextMenus: [{
          text: 'download data',
          click: node => {
            if (!node.isParent && node.parentId !== 4) {
              this.download(node);
            }
            else {
              vIziToast.info("just can download data");
            }
          }
        }],
        //右键菜单项
//        contextMenus: [{
//          text: 'New project',
//          click: node => {
//            console.log(node.id); // 本结点
//          }
//        }],
        buttons: [
          {
          key: 'detail', // 后台数据需要提供一个对应的key列表
          title: 'Show detail',
          icon: 'md-grid',
          click: node => {
            // 数据表格面板
            this.$store.dispatch(actionTypes.SHOW_PROJECT_DETAIL, true);
            this.$store.dispatch(actionTypes.PROJECT_DETAIL_ID, node.id);
          }
        },
          {
            key: 'map',
            text: 'Show on map',
            icon: 'md-map',
            click: node => {
              this.showLayer(node.id,node.name, node.parentId);
              vIziToast.success(node.id);
            }
          },
          {
            key: 'openModel',
            text: 'Open model',
            icon: 'ios-build',
             click: node => {
               //console.log(node);
               this.$emit('getSavedModelId', node.id)
             }
            },
        ],
      }
    },
    components: {
      VueToolbar, VueTree, ProjectCreate, ProjectsTable, ProjectDetail
    },
    methods: {
      refresh(){
        this.loadProjectsTree();
        vIziToast.success('Projects refreshed');
        //this.loadData();
        //vIziToast.success('refreshed');
        this.$store.dispatch(actionTypes.REFRESH_PROJECTS, false);
      },
      loadProjectsTree(){
        this.axios.get('./project/listProjects').then(( response ) => {
        	if(response.data.root.children.length>0)
            this.projects = response.data
        })
        let _this = this;
        setTimeout(function (){
            _this.$set(_this.projects.root,"isOpen",true);
        },2000)
      },
      download( node ){
        let getUrl = '';
        let typeName = '';
        if (node.semantic===modelingConst.SAMPLESEMANTIC) {
          getUrl = "/download/sample";
          typeName = 'text/csv';
        }
        else {
          getUrl = "/download/raster";
          typeName = 'image/tiff';
        }
        this.axios({
          url: getUrl,
          method: 'get',
          params: { layerId: node.id, parentId: node.parentId },
          responseType: 'blob',
        }).then(res => {

          let data = new Blob([res.data], { type: typeName });
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(data);
          link.download = node.title;
          link.click();
        })
      },
      detailButton( clickFn ){
        return {
          title: 'Manage it in datagrid',
          icon: 'fa fa-table',
          click: clickFn
        }
      },
      showCreatePanel(){
        this.creatorShow = true;
      },
      closeThis(){
        this.creatorShow = false;
      },
      showProjectTable(){
        this.$store.dispatch(actionTypes.SHOW_PROJECTS_TABLE, true);
      },
      // loadData(){
      //   this.$http.get('/project/listTree').then(resp => {
      //     this.projectsOption = resp.data;
      //   }).catch(err => {
      //     vIziToast.error(err.response.data.msg)
      //   });
      // },
      async showLayer( id, semantic, parentId ){
        if (semantic===modelingConst.SAMPLESEMANTIC) {
          let url = (parentId===modelingConst.USEDDATAFLAG) ? "/dataLayer/findSamples?layerId=" : "/dataLayer/findGeneratedSamples?layerId=";
          let samplesResp = await this.axios.get(url + id);
          let samples = samplesResp.data.data;
          let name = samplesResp.data.msg.split(';')[0].split('.')[0];
          let srid = samplesResp.data.msg.split(';')[1];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, name);
          let map = mapLayers.showSamples(mapPre, samples, name, srid);
          this.$store.dispatch('initMap', map);
        }
        else {
          let url = (parentId===modelingConst.USEDDATAFLAG) ? "/dataLayer/findRaster?layerId=" : "/dataLayer/findGeneratedRaster?layerId="
          let rasterResp = await this.axios.get(url + id);
          let rasterFile = rasterResp.data.data;
          let relativePath = rasterFile['rasterFilePath'];
          let top = rasterFile['boundaryUp'];
          let down = rasterFile['boundaryDown'];
          let left = rasterFile['boundaryLeft'];
          let right = rasterFile['boundaryRight'];
          let epsgCode = rasterFile['rasterAuthSrid'];
          let centerPoint = [(left + right) / 2, (top + down) / 2];
          let mapFileRootResp = await this.axios.post("./map/create?relativeFilePath=" + relativePath);
          let mapFileRoot = mapFileRootResp.data.data;
          let layerName = relativePath.split(".")[0];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, layerName);
          let map = mapLayers.loadMapServerWMS(mapPre, layerName, mapFileRoot);
          this.$store.dispatch('initMap', map);
          // let proj4Def = await mapLayers.findProj4Def(epsgCode);
          await mapLayers.layerOrientation(map, centerPoint, epsgCode);
        }
      }
    },
    created(){
      //this.loadData();
      this.loadProjectsTree();
    },
    watch:{
      refreshProjects:function (refresh) {
        if (refresh) {
          this.refresh();
        }
      },
      runModelFinished:function (finished){
        if(finished){
          let projectsShowNodes = this.projects.root.children[0].children;
          if(projectsShowNodes){
            for(let i = 0; i < projectsShowNodes.length ; i++){
              if(projectsShowNodes[i].name == "final data"){
                let projectsShowFinalDataNode = projectsShowNodes[i].children[0];
//                console.log(projectsShowFinalDataNode);
                if (projectsShowFinalDataNode !== null){
                  this.showLayer(projectsShowFinalDataNode.id, projectsShowFinalDataNode.name, projectsShowFinalDataNode.parentId);
                  let _this = this;
                  setTimeout(function (){
                    _this.$set(_this.projects.root.children[0],"isOpen",true);
                    _this.$set(_this.projects.root.children[0].children[i],"isOpen",true);
                  },500)
                }
              }
            }
          }
        }
        this.$store.dispatch(actionTypes.RUN_MODEL_FINISHED, false);
      }
    },
    computed: {
      ...mapState({
        show: state => state.ProjectSate.showProjectDetail,
        layerRefresh: state => state.DataState.dataSetLayerRefresh,
        baseMap: state => state.basemap,
        refreshProjects:state => state.ProjectSate.refreshProjects,
        runModelFinished:state => state.ProjectSate.runModelFinished,
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-tree.scss";
  @import "../../../assets/scss/context-menu.scss";
</style>
