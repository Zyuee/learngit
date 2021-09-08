<template>
  <transition name="slide-up">
    <j-panel :show="show" :options="panelOption" class="data-form">
      <Form :model="mappingModel">
        <Form-item label="Name" :label-width="70">
          <Input type="text" v-model="mappingModel.projcet_name"
                   placeholder="your model's name"></Input>
        </Form-item>
        <Form-item label="Description" :label-width="70">
          <Input type="textarea" v-model="mappingModel.projcet_description" :rows="2"
                   placeholder="A brief description about your model"></Input>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click="saveModel">Create</Button>
          <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>
  </transition>
</template>

<script>
  import JPanel from '../../widgets/JSPanel'
  import { vIziToast } from '../../../js/notify/v-iziToast'

  export default {
    name: 'model-create',
    data(){
      return {
        panelOption: {
          id: 'model_creator',
          paneltype: 'modal',
          theme: "success",
          headerTitle: 'Create a New Model',
          draggable: true,
          contentSize: {
            width: 400,
            height: 200
          },
          onclosed: this.closeThis,
          resizeit:false
        },
        mappingModel: {
          projcet_name: '',
          projcet_build_time: '',
          projcet_description: '',
          project_user_id: ''
        }
      }
    },
    components: { JPanel },
    methods: {
      closeThis(){
        this.$emit('close');
      },
      saveModel(){
        vIziToast.success('Model ' + this.mappingModel.projcet_name + ' created!');
        for (let key in this.mappingModel) {
          this.mappingModel[key] = '';
        }
        this.closeThis()
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
