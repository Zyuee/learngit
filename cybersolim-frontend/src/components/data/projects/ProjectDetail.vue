<template>
  <!--若当前用户为项目创建者，则其具有修改项目信息的权限-->
  <j-panel :options="panelOptions" :show="show">
    <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
    <Alert show-icon closable style="margin-top:38px;margin-bottom:-40px">
      <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
      Click button "Edit" above to edit details.
    </Alert>
    <Form :model="project" label-position="right" :label-width="88"
          class="data-details">
      <Row>
        <Col span="7">
          <Form-item label="Name">
            <!--<div >{{project.projectName}}</div>-->
            <Input v-model="project.projectName"></Input>
            <!--<Button type="text" icon="edit"></Button>-->
            <!--<Button type="text" icon="save"></Button>-->
          </Form-item>
        </Col>
        <Col span="7">
          <Form-item label="build time">
            <Input readonly v-model="project.projectBuildTime"
                   class="readonly-input"></Input>
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Form-item label="Description">
          <Input type="textarea" :rows="2" v-model="project.projectDescription"
                 :readonly="isReadonly"
                 :class="{'readonly-input':isReadonly}"></Input>
        </Form-item>
      </Row>
    </Form>
    <div class="data-detail-table">
      <Table size="small" border :data="tblData" :columns="cols" height="200">
      </Table>
    </div>
  </j-panel>
</template>

<script>
  import {mapState} from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import JPanel from '@/components/widgets/JSPanel'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import {vIziToast} from '@/js/notify/v-iziToast'
  import expandRow from '../datasets/table-expand.vue'
  import {modelingConst} from '../../constVariable'
  import mapLayers from '../../map/js/showLayers.js'

  export default {
    name: 'project-detail',
    data() {
      return {
        isReadonly: true,
        panelOptions: {
          id: 'proj-detail',
          headerTitle: 'Project Details',
          headerControls: {maximize: 'remove'},
          theme: 'primary',
          contentSize: {
            width: 800,
            height: 400
          },
          onclosed: this.closeThis,
          onwindowresize: true,
          resizeit: {disable: true}
        },
        project: {},
        date: null,
        toolbar: [
          {
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
            title: 'refresh data-set detail',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }],
        tblData: [],
//        project: {},
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
            key: 'dataName',
            width: 130,
            sortable: true,

          }, {
            title: 'semantic',
            key: 'semantic',
            width: 120
          },
          {
            title: 'owner',
            width: 180,
            key: 'userName'
          },
          {
            title: 'data source',
            width: 120,
            key: 'dataSource'
          }, {
            title: 'Operations',
            key: 'action',
            width: 285,
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    color: "red",
                    icon: 'md-map',
                  },

                  on: {
                    click: () => {
                      this.operateLayer(params.row);
                    }
                  }
                }, params.row.map),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'ios-trash'
                  },

                  on: {
                    click: () => {
                      this.deleteDataLayer(params.row);
                    }
                  }
                }, 'Delete'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'ios-cloud-download',
                  },
                  on: {
                    click: () => {
                      this.download(params.row)
                    }
                  }
                }, 'download')
              ])
            }
          }]
      }
    },
    components: {JPanel, VueToolbar, expandRow},
    methods: {
      closeThis() {
        this.$store.dispatch(actionTypes.SHOW_PROJECT_DETAIL, false);
      },
      editDetail() {
        this.isReadonly = !this.isReadonly;
      },
      refresh() {
        this.showProjectInfo();
        this.showProjectLayers();
        vIziToast.success('refreshed');

      },
      saveChange() {
        this.$http.post('/project/update', this.project).then(resp => {
          vIziToast.success(resp.data.msg);
        }).catch(err => {
          vIziToast.error('Update project failed.')
        });
      },
      download(node) {
        let getUrl = '';
        let typeName = '';
        let parentId = -99;
        if (node.semantic === modelingConst.SAMPLESEMANTIC) {
          getUrl = "/download/sample";
          typeName = 'text/csv';
        } else {
          getUrl = "/download/raster";
          typeName = 'image/tiff';
        }
        if (node.dataSource === modelingConst.USEDDATA) {
          parentId = modelingConst.USEDDATAFLAG
        } else {
          parentId = modelingConst.GENERATEDDATAFLAG
        }
        this.axios({
          url: getUrl,
          method: 'get',
          params: {layerId: node.layerId, parentId: parentId},
          responseType: 'blob',
        }).then(res => {
          let data = new Blob([res.data], {type: typeName});
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = node.dataName;
          link.click();
        })
      },
      showProjectInfo() {
        this.$http.get('/project/find/' + this.projectId).then(resp => {
//          console.log(resp.data);
          this.project = resp.data;
          let dt = new Date(this.project.projectBuildTime);
          this.date = dt.toLocaleString();
        }).catch(err => {
          vIziToast.error('No project data found.')
        });
      },
      showProjectLayers() {
        this.axios({
          url: '/project/detail',
          method: 'get',
          params: {projectId: this.projectId}
        }).then(response => {
          let data = response.data.data;
          for (let i = 0; i < data.length; i++) {
            data[i].map = 'show';
          }
          this.tblData = data;
        })
      },
      deleteDataLayer(row) {
        let layerId = row.layerId;
        let layerSemantic = row.layerSemantic;
        let deleteUrl = '';
        let parameters = {};
        if (layerSemantic === modelingConst.SAMPLESEMANTIC) {
          if (row.dataSource === modelingConst.USEDDATAFLAG) {
            deleteUrl = '/delete/usedSamples';
            parameters = {projectId: this.projectId, sampleId: layerId};
          } else {
            deleteUrl = '/delete/runModelSampleResult'
            parameters = {id: layerId};
          }
        } else {
          if (row.dataSource === modelingConst.USEDDATAFLAG) {
            deleteUrl = '/delete/usedRaster';
            parameters = {projectId: this.projectId, rasterId: layerId};
          } else {
            deleteUrl = '/delete/runModelRasterResult';
            parameters = {id: layerId};
          }
        }
        this.axios({
          url: deleteUrl,
          method: 'post',
          params: parameters
        }).then(response => {
          if (response.data.msg === modelingConst.SUCCESS) {
            vIziToast.success('delete successfully');
            this.showProjectLayers();
          }
        })
      },
      closeLayer(row) {
        let layerName = row.filePath.split('.')[0];
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
      async showLayer(row) {
        if (row.semantic === modelingConst.SAMPLESEMANTIC) {
          let url = (row.dataSource === modelingConst.USEDDATA) ? "/dataLayer/findSamples?layerId=" : "/dataLayer/findGeneratedSamples?layerId=";
          let samples = samplesResp.data.data;
          let name = samplesResp.data.msg.split(';')[0].split('.')[0];
          let srid = samplesResp.data.msg.split(';')[1];
          let mapPre = mapLayers.closeMapLayer(this.baseMap, name);
          let map = mapLayers.showSamples(mapPre, samples, name, srid);
          this.$store.dispatch('initMap', map);
        } else {
          let mapFileRootResp = await this.axios.post("./map/create?relativeFilePath=" + row.filePath);
          let mapFileRoot = mapFileRootResp.data.data;
          let layerName = row.filePath.split('.')[0];
          let epsgCode = row.layerProjection;
          let layerCenter = [(parseFloat(row.extentLeft) + parseFloat(row.extentRight)) / 2,
            (parseFloat(row.extentDown) + parseFloat(row.extentTop)) / 2];
          let map = mapLayers.loadMapServerWMS(this.baseMap, layerName, mapFileRoot);
          this.$store.dispatch('initMap', map);
          // let proj4Def =  mapLayers.findProj4Def(epsgCode);
          await mapLayers.layerOrientation(map, layerCenter, epsgCode);
        }

      }
    },
    watch: {

    },
    updated(){
        //console.log("a");
    },
    computed: {
      ...mapState(
        {
          show: state => state.ProjectSate.showProjectDetail,
          projectId: state => state.ProjectSate.projectId,
          baseMap: state => state.basemap
        })
    },
    mounted() {
      if (this.show) {
        this.showProjectInfo();
        this.showProjectLayers();
      }
    }
  }
</script>

<style lang="scss">
  @import "src/assets/scss/data-detail.scss";
</style>
