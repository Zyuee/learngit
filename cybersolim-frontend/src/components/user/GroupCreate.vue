<template>
  <j-panel :options="panelOptions" :show="show" class="data-form">
    <Form :model="group">
      <Form-item label="Name" :label-width="70">
        <validate-input icon="ios-briefcase" :has-error="errors.has('groupname')"
                        error-msg="Name should be at least 3 characters without spaces">
          <input type="text" v-model="group.groupName"
                 v-validate="{required:true,regex:/^[A-Za-z\u4e00-\u9fa5 0-9]{3,15}$/}"
                 name="groupname" class="ivu-input" placeholder="your group's name"/>
          <!--v-validate="'required|alpha_dash|min:3|projectNameChecker'"-->
        </validate-input>
      </Form-item>
      <Form-item label="Description" :label-width="70">
        <Input type="textarea" v-model="group.groupDescription" :rows="2"
               placeholder="A brief description about your group"></Input>
      </Form-item>
      <Form-item>
        <Button icon="md-checkmark" type="primary" @click="create" :loading="loading">Create</Button>
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
    name: 'group-create',
    data(){
      return {
        panelOptions: {
          headerTitle: 'Create Group',
          theme: 'primary',
          paneltype: 'modal',
          contentSize: {
            width: 400,
            height: 190
          },
          onclosed: this.closeThis
        },
        group: {
          groupName: '',
          groupDescription: ''
        },
        loading: false
      }
    },
    components: { JPanel, ValidateInput },
    methods: {
      closeThis(){
        this.$emit('close');
      },
      create(){
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$http.post('/group/create', this.group).then(
              resp => {
                vIziToast.success(resp.data.msg);
                this.$emit('refresh');
              }).catch(err => {
                vIziToast.error(err);
            });
            this.loading = false;
          }
          else {
            vIziToast.error("")
          }
        })
        this.closeThis();
      }
    },
    computed: {
      show(){
        return this.showCreate;
      }
    },
    props: {
      showCreate: {
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
