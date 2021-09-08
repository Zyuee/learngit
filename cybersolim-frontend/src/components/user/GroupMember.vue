<template>
  <div>
    <j-panel :options="panelOptions" :show="showMembers" class="data-form">
      <vue-toolbar :items="groupToolbar" class="data-toolbar"></vue-toolbar>
      <div class="data-table">
        <Table :columns="cols" :data="tblData" size="small" stripe :loading="loading" ref="groupTbl"
               no-data-text="No Group!" @on-select="handleTableSelect"></Table>
      </div>
      <delete-confirm :del-modal="delModal" @yes="deleteSelection" @cancel="delModal=false"></delete-confirm>
    </j-panel>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../store/action-types'
  import JPanel from '../widgets/JSPanel'
  import VueToolbar from '../widgets/toolbar/Toolbar'
  import GroupCreate from './GroupCreate.vue'
  import GroupJoin from './GroupJoin.vue'
  import { vIziToast } from '../../js/notify/v-iziToast'
  import DeleteConfirm  from '../widgets/modals/Delete-Confirm'

  export default {
    name: 'group-member',
    props: {
      showMembers:{
        type:Boolean,
        default: false
      },
      groupId: {
        type: Number,
        default: null
      },
      groupName: {
        type: String,
        default: null
      },
      groupRole:{
        type:String,
        default:null
      }
    },
    data(){
      return {
        // JSPanel 选项，不用设置content值
        panelOptions: {
          headerTitle: 'Group '+this.groupName,
          theme: '#663399',
          contentSize: {
            width: 580,
            height: 400
          },
          show: 'animated fadeInDownBig',
          position: {
            my: "center",
            at: "center"
          },
          dragit: {
            containment: 0
          },
          headerControls: {
            maximize: 'remove' // 不允许最大
          },
          resizeit: {
            minWidth: 450,
            minHeight: 280,
            handles: 'n,s' // 只允许竖直方向改变
          },
          onclosed: this.closeThis,
        },
        groupToolbar: [
          {
            title: 'Invite user',
            click: this.invite,
            icon: 'md-add',
            size: 17,
            text: 'Invite'
          },{
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
        cols: [{
          type: 'selection',
          width: 55,
          align: 'left'
        }, {
          title: 'Name',
          align: 'center',
          width: 150,
          render:(h,params)=>{return h('span',`${params.row.userFirstName} ${params.row.userLastName}`);}
        }, {
          title: 'Role in Group',
          key: 'roleName',
          sortable: true,
          align: 'center',
          width: 130
        }, {
          title: 'Management',
          key: 'action',
          width: 180,
          align: 'center',
          render: ( h, params ) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.isDeleteMemberPermitted(params.row.roleName)
                },
                on: {
                  click: () => {
                    this.delModal = true;
                    this.removeIndex = params.row.groupId;
                  }
                }
              }, 'Remove')
            ]);
          }
        }],
        tblData: [],
        page: {
          total: 0,
          current: 1
        },
        panel: {
          // 邀请成员
          invite: false,
        },
        loading: true,
        delModal: false,
        removeIndex: null,

        members: [],
      }
    },
    components: { JPanel, GroupCreate, GroupJoin, VueToolbar, DeleteConfirm },
    methods: {
      closeThis(){
        this.$emit('close');
        this.showMembers=false;
      },
      invite(){
        this.panel.invite = true;
      },
      loadData(){
        var groupId = this.groupId;
        this.axios({
          url: '/group/members',
          method: 'get',
          params: {groupId}
        }).then(response => {
          this.tblData = response.data;
          this.loading = false;
        }).catch(err => {
          console.log(err)
        })

        this.panelOptions={
          headerTitle: 'Group '+this.groupName,
            theme: '#663399',
            contentSize: {
            width: 580,
              height: 400
          },
          show: 'animated fadeInDownBig',
            position: {
            my: "center",
              at: "center"
          },
          dragit: {
            containment: 0
          },
          headerControls: {
            maximize: 'remove' // 不允许最大
          },
          resizeit: {
            minWidth: 580,
              minHeight: 280,
              handles: 'n,s' // 只允许竖直方向改变
          },
          onclosed: this.closeThis
        }
      },
      refresh(){
        this.loading = true;
        this.loadData();
      },
      handleTableSelect( selection, row ){
        console.log(selection);
        console.log(row);
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
          vIziToast.error("No selected users.")
      },
      isGroupAdmin(roleName){
        if(this.myRole!=="group_admin" || roleName==="group_admin"){
          return true;
        }
      },
      isDeleteMemberPermitted(rowRoleName){
        // return;
        if(this.groupRole==='group_admin' && rowRoleName!=='group_admin'){

          return true;
        }
      }

    },
    watch: {
      groupId: function () {
        this.loadData();
      }
    },
    computed: {
      show(){
        return this.showMembers;
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../data/scss/data-table.scss";

  .data-form {
    padding: 5px;
  }

  /* .data-toolbar {
     margin-top: -10px;
   }*/

  /*为何没有起作用*/
  .ivu-tabs-bar {
    margin-bottom: 0 !important;
  }
</style>
