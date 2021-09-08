<!--TODO: initiative inviting is not supported yet.-->
<template>
  <j-panel :options="panelOptions" :show="show" class="data-form">
    <Form :model="group">
      <Form-item>
        <Input v-model="group.groupName" placeholder="User Email"></Input>
      </Form-item>
      <Form-item>
        <Input v-model="userEmail" placeholder="Email of the user you want to share to"></Input>
      </Form-item>
      <Form-item>
        <Button icon="md-checkmark" type="primary" @click="invite">invite</Button>
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
          headerTitle: 'Invite user',
          theme: 'success',
          paneltype: 'modal',
          contentSize: {
            width: 370,
            height: 170
          },
          onclosed: this.closeThis
        },
        userId:0,
        userEmail:'',
      }
    },
    components: { JPanel, ValidateInput },
    methods: {
      closeThis(){
        this.$emit('close')
      },
      invite(){
        this.axios({//先寻找用户
          url:'/auth/find',
          method:'GET',
          params: {
            email:this.userEmail,
          }
        }).then(response=>{
          if(!response.data.data){
            vIziToast.error('user not found',2000);
            return false;
          }
          this.userId=response.data.data;
          this.axios({//先寻找用户
            url:'/group/invite',
            method:'POST',
            params: {
              email:this.userEmail,
            }
          }).then(response=>{
            if(!response.data.data){
              vIziToast.error('user not found',2000);
              return false;
            }
            this.userId=response.data.data;

          })
        })
      }
    },
  }
</script>

<style lang="scss">
  @import "../data/scss/data-create.scss";

</style>
