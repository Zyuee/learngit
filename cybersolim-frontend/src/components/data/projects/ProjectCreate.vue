<template>
  <transition name="slide-up">
    <j-panel :options="panelOption" :show="show" class="data-form">
      <Form :model="project">
        <Form-item  label="Name" :label-width="70">
          <validate-input icon="ios-briefcase" :has-error="errors.has('projname')"
                          error-msg="Name must not be empty and should be at least 3 characters">
            <input type="text" v-model="project.projectName" data-vv-validate-on="blur"
                   v-validate="'required|alpha_spaces|min:3|projectNameChecker'"
                   name="projname" class="ivu-input" placeholder="your project's name"/>
          </validate-input>
        </Form-item>
        <Form-item label="Description" :label-width="70">
          <Input type="textarea" v-model="project.projectDescription" :rows="2"
                 placeholder="A brief description about your project"></Input>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click="saveProject" :loading="loading">Create</Button>
          <Button icon="close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>
  </transition>
</template>

<script>
  import JPanel from '../../widgets/JSPanel'
  import { vIziToast } from '../../../js/notify/v-iziToast'
  import ValidateInput from '../../widgets/ValidateInput'

  export default {
    name: 'proj-create',
    data(){
      return {
        panelOption: {
          id: 'proj_creator',
          paneltype: 'modal',
          theme: "success",
          headerTitle: 'Create a New Project',
          draggable: true,
          headerControls: {maximize: "remove"},
          contentSize: {
            width: 400,
            height: 190
          },
          onclosed: this.closeThis
        },
        project: {
          projectName: '',
          projectDescription: ''
        },
        loading: false
      }
    },
    components: { JPanel, ValidateInput },
    methods: {
      closeThis(){
        this.$emit('close');
      },
      saveProject(){
        this.loading = true;
        this.$validator.validateAll().then(( valid ) => {
          if (valid) {
            this.$http.post('/project/create', this.project).then(
              resp => {
                vIziToast.success('Project ' + this.project.projectName + ' created!');
                // 清空
                for (let key in this.project) {
                  this.project[key] = '';
                }
                this.loading = false;
                this.closeThis();
              }
            ).catch(err => {
              vIziToast.error(err.response.data.msg);
              this.loading = false;
              this.closeThis();
            });
          }
          else {
            vIziToast.warning("Input data validate failed! Please check.")
          }
        });
      }
    },
    computed: {
      show(){
        return this.createShow;
      }
    },
    props: {
      createShow: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/data-create.scss";
</style>
