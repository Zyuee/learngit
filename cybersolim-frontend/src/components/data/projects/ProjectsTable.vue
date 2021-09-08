<template>
  <div>
    <!--new project-->
    <project-create :createShow="creatorShow" @close="closeCreator"></project-create>
    <!--projects table-->
    <j-panel :options="panelOptions" :show="show" class="data-table-panel">
      <vue-toolbar :items="toolbar" class="data-toolbar"></vue-toolbar>
      <div class="data-table">
        <Table :data="tableData" size="small" :columns="tableColumns" stripe border
               @on-select="tblSelect" @on-select-all="tblSelectAll" no-data-text="No-Data"></Table>
        <!--分页-->
        <div class="table-page">
          <div style="float: right;">
            <Page :total="dataCount" :current="1" :page-size="pageSize" show-total @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </j-panel>
    <!--delete confirm-->
    <delete-confirm :del-modal="delModal" :deleting="deleting" @yes="deleteProjects"
                    @cancel="delModal=false; deleting=false"></delete-confirm>

    <data-upload :show-upload="showUpload" @close="showUpload=false"></data-upload>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import { vIziToast } from '../../../js/notify/v-iziToast'
  import JPanel from '../../widgets/JSPanel'
  import VueToolbar from '../../widgets/toolbar/Toolbar'
  import ProjectCreate from './ProjectCreate'
  import DeleteConfirm  from '../../widgets/modals/Delete-Confirm'
  import DataUpload from '../datasets/DataUpload.vue'

  export default {
    name: 'projects-table',
    data(){
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
            key: 'projectName',
            sortable: true,
            width: 120
          }, {
            title: 'Date',
            key: 'projectBuildTime',
            sortable: true,
            width: 110
          }, {
            title: 'user',
            key: 'userEmail',
            sortable: true,
            width: 120
          }, {
            title: 'Description',
            key: 'projectDescription'
          }, {
            title: 'Operation',
            key: 'action',
            width: 180,
            align: 'center',
            render: ( h, params ) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'stats-bars'
                  },
                  on: {
                    click: () => {
                      this.$store.dispatch(actionTypes.SHOW_PROJECT_ID,params.row.projectId)
                      this.$store.dispatch(actionTypes.SHOW_PROJECT_DETAIL, true);
                    }
                  }
                }, 'detail'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.selectedRows=[];
                      this.selectedRows.push(params.row);
                      this.delConfirm();
                    }
                  }
                }, 'Delete')
              ]);
            }
          }],
        // 项目管理面板
        panelOptions: {
          id: 'projects_table',
          theme: 'primary',//"#0074D9",
          headerTitle: 'Manage All Projects',
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
            title: 'delete selected projects',
            click: this.delConfirm,
            icon: 'md-trash',
            size: 17,
            text: 'Delete'
          }],
        delModal: false,
        deleting: false,
        showUpload: false,
        dataCount:0,
        pageSize:6,
        page:{
          total:0,
          current:1,
          pageSize:6,
          rows:[],
          pages:null
        }
      }
    },
    components: { JPanel, VueToolbar, ProjectCreate, DeleteConfirm, DataUpload },
    methods: {
      tblSelect( selection, row ){
//        console.log(row);
        this.selectedRows = selection;
      },
      tblSelectAll: selection => {
        this.selectedRows = selection;
      },
      loadProjects(){
        this.axios({
          url:'/project/list',
          method:'POST',
//          headers:{"content-type":"application/json charset=utf-8"},
          data:this.page,
        }).then((response)=>{
          this.tableData = response.data.rows;
          this.dataCount = response.data.total;
        })
      },
      changePage(index){
        this.page.current = index;
        this.page.pageSize = this.pageSize;
        this.axios({
          url:'/project/list',
          method:'POST',
          data:this.page,
        }).then((response)=>{
          this.tableData = response.data.rows;
        })
      },
      closeCreator(){
        this.creatorShow = false;
      },
      closeThis(){
        this.$store.dispatch(actionTypes.SHOW_PROJECTS_TABLE, false);
      },
      showCreatePanel(){
        this.creatorShow = true;//创建项目的jspanel
      },
      uploadData(){
        this.showUpload = true;
      },
      delConfirm(){

        this.delModal = true;
      },

      deleteProjects(){
        if (this.selectedRows.length === 0)
        {
          vIziToast.error("No selected rows.");
          return;
        }
        // 删除时
        this.deleting = true;
        // 删除之后
        let ids = [];
        for (let row in this.selectedRows){
            ids.push(this.selectedRows[row].projectId);
        }
        this.axios({
          url:'/delete/project?projectIds=' + ids,
          method:'delete',
        }).then(response => {
          if (response.data.msg === 'success'){
            vIziToast.success('delete successfully',1000,'center');
            this.loadProjects();
            this.deleting = false;
            this.delModal = false;

          }
        })

      }
    },
    watch: {
      show: function () {
          if(this.show){
            this.loadProjects();
          }

      }
    },
    computed: {
      ...mapState({
        show: state => state.ProjectSate.showProjects
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-table.scss";
</style>
