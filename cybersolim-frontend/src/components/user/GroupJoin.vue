<template>
  <j-panel :options="panelOptions" :show="show" class="data-form">
    <Form :model="group">
      <Form-item>
        <!--<Select v-model="group.groupName" filterable>-->
          <!--<Option v-for="item in groupList" :value="item.groupId" :key="item.groupName" placeholder="Group name">-->
            <!--{{ item.groupName }}-->
          <!--</Option>-->
        <!--</Select>-->

        <Input v-model="group.groupName" placeholder="Group name"></Input>
      </Form-item>
      <Form-item>
        <validate-input icon="ios-lock" :has-error="errors.has('pwd')"
                        error-msg="Invite Code should be at least 10 characters">
          <input type="text" v-model="group.groupPassword" data-vv-validate-on="blur"
                 v-validate="'required|alpha_num|min:10'"
                 name="pwd" class="ivu-input"
                 placeholder="Invite code (or group password) of the group"/>
        </validate-input>
      </Form-item>
      <Form-item>
        <Button icon="md-checkmark" type="primary" @click="join">Join</Button>
        <Button icon="md-close" @click="closeThis">Cancel</Button>
      </Form-item>
    </Form>
  </j-panel>
</template>

<script>
  import { mapState } from 'vuex'
  import JPanel from '@/components/widgets/JSPanel'
  import ValidateInput from '@/components/widgets/ValidateInput'
  import { vIziToast } from '../../js/notify/v-iziToast'

  export default {
    name: 'group-join',
    data(){
      return {
        panelOptions: {
          headerTitle: 'Join a Group',
          theme: 'success',
          paneltype: 'modal',
          contentSize: {
            width: 370,
            height: 170
          },
          onclosed: this.closeThis
        },
        groupList: [],
        group: {
          groupName: '',
          groupPassword: ''
        }
      }
    },
    components: { JPanel, ValidateInput },
    methods: {
      closeThis(){
        this.$emit('close')
      },
      join(){
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$http.post("/group/join", this.group).then(resp => {
              vIziToast.success(resp.data.msg)
            }).catch(err => {
              vIziToast.error(err.response.data.msg)
            })
          }
          else {
            vIziToast.error("Validation failed! Please CHECK!")
          }
        }).catch(err => {

        });
      }
    },
    mounted(){
      if (this.show) {
        this.$http.get('/group/groups').then(resp => {
          this.groupList = resp.data;
        }).catch(err => {
          vIziToast.error(err)
        });
      }
    },
    computed: {
      show(){
        return this.showJoin;
      }
    },
    props: {
      showJoin: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  }
</script>

<style lang="scss">
  @import "../data/scss/data-create.scss";

</style>
