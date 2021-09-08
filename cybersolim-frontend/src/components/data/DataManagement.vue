<!--
@author: houzhiwei
@date: 2017/9/13 23:18
-->
<template>
  <Row :gutter="16" type="flex" justify="start">
    <Col span="4" xs="4" sm="4" md="4" lg="4">
    <Menu theme="light">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper"></Icon>
          Projects
        </template>
        <MenuItem name="1-1">文章管理</MenuItem>
        <MenuItem name="1-2">评论管理</MenuItem>
        <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-people"></Icon>
          DataSets
        </template>
        <MenuItem name="2-1">新增用户</MenuItem>
        <MenuItem name="2-2">活跃用户</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          Models
        </template>
        <MenuGroup title="使用">
          <MenuItem name="3-1">新增和启动</MenuItem>
          <MenuItem name="3-2">活跃分析</MenuItem>
          <MenuItem name="3-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="留存">
          <MenuItem name="3-4">用户留存</MenuItem>
          <MenuItem name="3-5">流失用户</MenuItem>
        </MenuGroup>
      </Submenu>
    </Menu>
    </Col>
    <Col span="20" xs="20" sm="20" md="20" lg="20">
    <vue-toolbar :items="toolbar" class="data-toolbar dm-toolbar"></vue-toolbar>
    <div class="data-table dm-table">
      <Table :data="tableData" size="small" :columns="tableColumns" stripe border @on-select="tblSelect"
             @on-select-all="tblSelectAll" no-data-text="No-Data"></Table>
      <!--分页-->
      <div class="table-page">
        <div style="float: right;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    </Col>
  </Row>

</template>

<script>
  import VueToolbar from '../widgets/toolbar/Toolbar'

  export default {
    name: 'data-management',
    data(){
      return {
        tableData: [
          {
            project_id: 6,
            projcet_name: 'anhui',
            projcet_build_time: '2017-05-06',
            project_user_id: 'houzw',
            projcet_description: 'an hui project'
          }, {
            project_id: 7,
            projcet_name: 'hunan',
            projcet_build_time: '2017-05-07',
            project_user_id: 'houzw',
            projcet_description: 'hu nan project'
          }],
        tableColumns: [
          {
            type: 'selection',
            align: 'center',
            width: 50,
            className: 'table-col'
          }, {
            title: 'Name',
            key: 'projcet_name',
            sortable: true,
            width: 90
          }, {
            title: 'Date',
            key: 'projcet_build_time',
            sortable: true,
            width: 110
          }, {
            title: 'Creator',
            key: 'project_user_id',
            sortable: true,
            width: 100
          }, {
            title: 'Description',
            key: 'projcet_description',
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
                      console.log(params); // row、column 和 index
                      //params.row.project_id;
                    }
                  }
                }, 'Details'),
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
                }, 'Delete'),
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
        toolbar: [
          {
            title: 'create new project',
            click: this.showCreatePanel,
            icon: 'plus-round',
            size: 17,
            text: 'New'
          }, {
            title: 'upload data to selected project',
            click: this.delConfirm,
            icon: 'upload',
            size: 17,
            text: 'Upload'
          }, {
            title: 'delete selected projects',
            click: this.delConfirm,
            icon: 'trash-a',
            size: 17,
            text: 'Delete'
          }]
      }
    },
    components: { VueToolbar },
    methods: {
      tblSelect(){

      },
      tblSelectAll(){

      },
      changePage(){

      },
      showCreatePanel(){
        alert('showCreatePanel');
      },
      delConfirm(){
        alert('delConfirm');
      }
    },
    computed: {}
  }
</script>

<style lang="scss">
  .dm-toolbar {
    position: relative !important;
    left: 0;
    width: auto !important;

  }

  .dm-table {
    margin-top: .2rem !important;
  }
</style>
