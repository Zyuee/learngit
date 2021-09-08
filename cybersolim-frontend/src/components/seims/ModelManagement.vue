<!--
暂未使用
-->
<template>
  <j-panel :options="panelOptions" :show="show">
    <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
    <div class="data-table">
      <Table :data="tableData" size="small" :columns="tableColumns" stripe border @on-select="tblSelect"
             @on-select-all="tblSelectAll" no-data-text="No-Models-Yet" height="340"></Table>
      <!--分页-->
      <!--<div class="table-page">
      <div style="float: right;">
      <Page :total="100" :current="1" @on-change="changePage"></Page>
      </div>
      </div>-->
    </div>
  </j-panel>
</template>

<script>
  import {mapState} from 'vuex'
  import JSPanel from '@/components/widgets/JSPanel'
  import VueToolbar from '@/components/widgets/toolbar/Toolbar'
  import * as actionTypes from '@/store/action-types'

  export default {
    name: 'seims-manage',
    data() {
      return {
        panelOptions: {
          headerTitle: 'SEIMS Model Management',
          contentSize: {
            width: 700,
            height: 350
          },
          onclosed: this.closeThis,
        },
        toolbar: [
          {
            title: 'create new model',
            click: this.showGenerateModel,
            icon: 'md-create',
            size: 17,
            text: 'New'
          },
          {
            title: 'delete selected dataSets',
            click: this.delConfirm,
            icon: 'md-trash',
            size: 17,
            text: 'Delete selected'
          },
          {
            title: 'refresh',
            click: this.refresh,
            icon: 'md-refresh',
            text: 'refresh'
          }
        ],
        initContext: {},
        selectedRows: [],
        tableData: [],
        tableColumns: [
          {
            type: 'selection',
            align: 'center',
            width: 30,
            className: 'table-col'
          }, {
            title: 'Name',
            key: 'modelName',
            sortable: true,
            width: 120
          }, {
            title: 'Date',
            key: 'generatedTime',
            sortable: true,
            width: 160
          }, {
            title: 'Description',
            key: 'description',
            width: 150
          }, {
            title: 'Operation',
            key: 'action',
            width: 270,
            align: 'center',
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'eye'
                  },
                  on: {
                    click: () => {
                      this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL_ID, params.row.datasetId);
                      this.$store.dispatch(actionTypes.SHOW_DATASET_DETAIL, true);
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      let ids = [];
                      ids.push(params.row.datasetId);
                      this.download(ids);
                    }
                  }
                }, 'Down-Config'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'share'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, 'Share')
              ]);
            }
          }],
      }
    },
    mounted() {
      this.$http.get('/seims/models').then((json) => {
        console.dir(json.data);
        this.tableData = json.data;
      }).catch((err) => {

      });
    },
    components: {JSPanel, VueToolbar},
    methods: {
      closeThis() {
        this.$store.dispatch(actionTypes.SHOW_SEIMS_MANAGE, false);
      },
      showGenerateModel() {
        this.$store.dispatch(actionTypes.SHOW_SEIMS_MODEL, true);
      },
      download(ids) {
        this.$http.get('/seims/download/config', ids).then((resp) => {

        })
      },
      tblSelect(selection, row) {
        this.selectedRows = selection;
      },
      tblSelectAll: selection => {
        this.selectedRows = selection;
      },
      refresh(){
        this.$http.get('/seims/models').then((json) => {
          this.tableData = json.data;
        }).catch((err) => {

        });
      }
    },
    computed: {
      ...mapState({
        show: state => state.SeimsState.showSeimsManage
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../data/scss/data-table.scss";
</style>
