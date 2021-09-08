<template>
  <div>
    <!--new model-->
    <model-create :createShow="creatorShow"
                  @close="closeCreator"></model-create>
    <!--models table-->
    <j-panel :show="showAllModels" :options="panelOptions"
             class="data-table-panel">
      <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
      <div class="data-table">
        <Table :data="tableData" size="small" :columns="tableColumns" stripe
               border @on-select="tblSelect"
               @on-select-all="tblSelectAll" no-data-text="No-Models"></Table>
        <!--分页-->
        <div class="table-page">
          <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </j-panel>
    <!--delete confirm-->
    <delete-confirm :del-modal="delModal" :deleting="deleting"
                    @yes="deleteModels"
                    @cancel="delModal=false"></delete-confirm>
    <ModelStructureDetail :detail-show="showDetailPanel" :model-id="modelId"
                          @close="closeSeimsDetail"></ModelStructureDetail>
  </div>
</template>

<script>

  import {mapState} from 'vuex'
  import moment from 'moment'
  import {vIziToast} from '../../../js/notify/v-iziToast'
  import JPanel from '../../widgets/JSPanel'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import ModelCreate from './ModelCreate'
  import DeleteConfirm from '../../widgets/modals/Delete-Confirm'
  import ModelStructureDetail from "../../seims/ModelStructureDetail";

  export default {
    name: 'models-table',
    data() {
      return {
        tableData: [],
        tableColumns: [
          {
            type: 'selection',
            align: 'center',
            width: 45,
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
            width: 120,
            render: (h, params) => {
              return h('div', moment(params.row.generatedTime).format("YYYY:MM:DD"));
            }
          }, {
            title: 'Creator',
            key: 'userId',
            sortable: true,
            width: 120
          }, {
            title: 'Description',
            key: 'description'
          }, {
            title: 'Operation',
            key: 'action',
            width: 220,
            align: 'center',
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'stats-bars'
                  },
                  on: {
                    click: () => {
                      this.modelId = params.row.id;
                      this.showDetailPanel = true;
                    }
                  }
                }, 'Model Config'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, 'Delete')
              ]);
            }
          }],
        // 项目管理面板
        panelOptions: {
          id: 'models_table',
          theme: 'primary',//"#0074D9",
          headerTitle: 'Manage All Models',
          draggable: true,
          contentSize: {
            width: 800,
            height: 400
          },
          onclosed: this.closeThis
        },
        creatorShow: false, // 显示创建面板
        selectedRows: [], // 选择的行
        toolbar: [
          {
            title: 'create new Model',
            click: this.showCreatePanel,
            icon: 'md-add',
            size: 17,
            text: 'New'
          }, {
            title: 'delete selected models',
            click: this.delConfirm,
            icon: 'md-trash',
            size: 17,
            text: 'Delete'
          }],
        delModal: false,
        deleting: false,
        showDetailPanel: false,
        modelId: -1,
      }
    },
    components: {
      JPanel,
      VueToolbar,
      ModelCreate,
      DeleteConfirm,
      ModelStructureDetail
    },
    methods: {
      tblSelect(selection, row) {
//        console.log(row);
        this.selectedRows = selection;
      },
      tblSelectAll: selection => {
        this.selectedRows = selection;
      },
      changePage() {

      },
      closeCreator() {
        this.creatorShow = false;
      },
      closeSeimsDetail() {
        this.showDetailPanel = false;
      },
      showCreatePanel() {
        this.creatorShow = true;//创建项目的jspanel
      },
      delConfirm() {
        console.log(this.selectedRows);
        this.delModal = true;
      },
      deleteModels() {
        // 删除时
        this.deleting = true;
        // 删除之后
        setTimeout(() => {
          this.deleting = false;
          this.delModal = false;
          vIziToast.success('Deletion success!');
        }, 3000);
      }
    },
    watch: {
      showAllModels: function () {
        if (this.showAllModels) {
          this.$http.get("/seims/models").then(resp => {
            this.tableData = resp.data;
          });
        }
      }
    },
    computed: {
      ...mapState({
        // show: state => state.WidgetsShowState.showModels
      })
    },
    props: {
      showAllModels: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-table.scss";
</style>
