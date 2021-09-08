<template>
  <div>
    <group-create :showCreate="panel.create" @close="closeCreate" @refresh="refresh"></group-create>
    <group-join :showJoin="panel.join" @close="closeJoin"></group-join>
    <group-member :show-members="panel.members"
                  :group-id="computedSelectedGroup.groupId"
                  :group-name="computedSelectedGroup.groupName"
                  :group-role="computedSelectedGroup.groupRole"
                  @close="closeMember"
    ></group-member>
    <j-panel :options="panelOptions" :show="show" class="data-form">
      <vue-toolbar :items="groupToolbar" class="data-toolbar"></vue-toolbar>
      <div class="data-table">
        <Table :columns="cols" :data="tblData" size="small" stripe :loading="loading" ref="groupTbl" height="350"
               no-data-text="No Group!" @on-select="handleTableSelect"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="page.total" :current="page.current" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </j-panel>
    <!--delete confirm-->
    <delete-confirm :del-modal="delModal" @yes="deleteSelection" @cancel="delModal=false"></delete-confirm>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import * as actionTypes from '../../store/action-types'
  import JPanel from '../widgets/JSPanel'
  import VueToolbar from '../widgets/toolbar/Toolbar'
  import GroupCreate from './GroupCreate.vue'
  import GroupJoin from './GroupJoin.vue'
  import { vIziToast } from '../../js/notify/v-iziToast'
  import DeleteConfirm  from '../widgets/modals/Delete-Confirm'
  import expandRow from './GroupExpand.vue'
  import GroupMember from './GroupMember.vue'

  export default {
    name: 'group',
    data(){
      return {
        // JSPanel 选项，不用设置content值
        panelOptions: {
          headerTitle: 'My Groups',
          theme: '#663399',
          contentSize: {
            width: 900,
            height: 450
          },
          show: 'animated fadeInDownBig',
          dragit: {
            containment: 0
          },
          headerControls: {
            maximize: 'remove' // 不允许最大
          },
          resizeit: {
            minWidth: 850,
            minHeight: 300,
            handles: 'n,s' // 只允许竖直方向改变
          },
          onclosed: this.closeThis
        },
        groupToolbar: [
          {
            title: 'Create new group',
            click: this.create,
            icon: 'md-add',
            size: 17,
            text: 'New'
          },
          {
            title: 'Join a group',
            click: this.join,
            icon: 'md-person-add',
            size: 17,
            text: 'Join'
          }, {
            title: 'Refresh',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }, {
            title: 'Delete selected group',
            click: this.deleteSelection,
            icon: 'md-remove',
            size: 17,
            text: 'Delete'
          }],
        dataToolbar: [
          {
            title: 'Upload',
            click: this.create,
            icon: 'md-add',
            size: 17,
            text: 'Upload'
          },
          {
            title: 'Download',
            click: this.join,
            icon: 'md-person-add',
            size: 17,
            text: 'Download'
          }, {
            title: 'Refresh',
            click: this.refresh,
            icon: 'md-refresh',
            size: 17,
            text: 'Refresh'
          }],
        cols: [{
          type: 'selection',
          width: 55,
          align: 'left'
        }, {
          title: 'Name',
          key: 'groupName',
          align: 'center',
          width: 100
        }, {
          title: 'My Role',
          key: 'roleName',
          sortable: true,
          align: 'center',
          width: 120
        }, {
          title: 'Invite Code',
          key: 'groupPassword',
          align: 'center',
          width: 100
        }, {
          title: 'Members',
          width: 100,
          align: 'center',
          render: ( h, params ) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                title: params.row.membersNum + ' members',
                placement: 'bottom'
              }
            }, [h('Tag', params.row.membersNum),
                h('div', { slot: 'content' },
                  [h('ul', this.tblData[params.index].members.map(item => {
                    return h('li', {
                      style: {
                        textAlign: 'center'
                      }
                    }, item.userFirstName + " " + item.userLastName)
                  }))]
                )]);
          }
        }, {
          title: 'Management',
          key: 'action',
          width: 250,
          align: 'center',
          render: ( h, params ) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.selectedGroup.groupId=params.row.groupId;
                    this.selectedGroup.groupName=params.row.groupName;
                    this.selectedGroup.groupRole=params.row.roleName;
                    this.member();
                  }
                }
              }, 'Members'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.groupId=params.row.groupId;
                    this.selectedGroup.groupRole=params.row.roleName;
                    this.$http.get('/group/datasets', { params: { groupId: params.row.groupId } }).then(resp => {
                      this.members=resp.data;
                    });
                  }
                }
              }, 'Data'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: params.row.roleName==="group_admin" ? false : true
                },
                on: {
                  click: () => {
                    this.delModal = true;
                    this.removeIndex = params.row.groupId;
                  }
                }
              //}, 'DataSets')
              }, 'Delete')
            ]);
          }
        }, {
          type: 'expand',
          width: 50,
          render: ( h, params ) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        }],
        tblData: [],
        page: {
          total: 0,
          current: 1
        },
        panel: {
          // 新建组
          create: false,
          // 邀请成员
          invite: false,
          // 邀请成员
          join: false,
          // 查看成员
          members:false,
        },
        loading: true,
        delModal: false,
        removeIndex: null,

        members: [],
        groupId: null,
        selectedGroup:{
          groupId:null,
          groupName:'',
          groupRole:'',
        },
      }
    },
    components: { JPanel, GroupCreate, GroupJoin, VueToolbar, DeleteConfirm, expandRow, GroupMember },
    methods: {
      /* handleTabRemove ( name ) {
       console.log(name);
       this['tabs.tab' + name] = false;
       },*/
      closeThis(){
        this.$store.dispatch(actionTypes.SHOW_GROUP, false);
      },
      create(){
        this.panel.create = true;
      },
      closeCreate(){
        this.panel.create = false;
      },
      member(){
        this.panel.members = true;
      },
      closeMember(){
        this.panel.members = false;
      },
      invite(){
        this.panel.invite = true;
      },
      join(){
        this.panel.join = true;
      },
      closeJoin(){
        this.panel.join = false;
      },
      loadData(){
        this.$http.get('/group/groupsInfo', { params: { current: this.page.current, pageSize: 5 } }).then(resp => {
          this.tblData = resp.data.rows;
          this.total = resp.data.total;
          this.loading = false;
        });
      },
      changePage( page ){
        console.log(page);
        this.page.current = page;
      },
      refresh(){
        this.loading = true;
        this.loadData();
      },
      handleTableSelect( selection, row ){
        console.log(selection);
        console.log(row);
      },
      handleTabRemove(){
        this.members=[];
      },
      deleteSelection(){
        if (this.removeIndex) {
          this.$http.delete('/group/delete', { params: { id: this.removeIndex } }).then(resp => {
            vIziToast.info(resp.data.msg);
            this.refresh();
          }).catch(err => {
            console.log(err);
            vIziToast.error(err);
          });
          this.delModal = false;
        }
        else
          vIziToast.error("No selected groups.")
      },
    },
    watch: {
      show: function() {
        this.loadData();
      }
    },
    computed: {
      ...mapState({
        show: state => state.UserState.showGroup
      }),
      computedSelectedGroup:function (){
        return this.selectedGroup;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../data/scss/data-table.scss";

  .data-form {
    padding: 5px;
  }
  .ivu-table-body{
    height: 90%;
  }
  /* .data-toolbar {
     margin-top: -10px;
   }*/

  /*为何没有起作用*/
  .ivu-tabs-bar {
    margin-bottom: 0 !important;
  }
</style>
