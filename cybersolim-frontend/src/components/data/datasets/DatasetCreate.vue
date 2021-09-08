<template>
  <transition name="slide-up">
    <j-panel :options="panelOption" :show="show" class="data-form">
      <Form :model="dataset">
        <Form-item label="Name" :label-width="70">
          <Input type="text" v-model="dataset.datasetName" placeholder="your dataset's name"></Input>
        </Form-item>
        <Form-item label="Description" :label-width="70">
          <Input type="textarea" v-model="dataset.datasetDescription" :rows="2" placeholder="A brief description about your dataset"></Input>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click="saveProject">Create</Button>
          <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>
  </transition>
</template>

<script>
import JPanel from '../../widgets/JSPanel'
import { vIziToast } from '../../../js/notify/v-iziToast'
import {mapState} from 'vuex'
import * as actionTypes from '@/store/action-types'
export default {
  name: 'dataset-create',
  data() {
    return {
      panelOption: {
        id: 'proj_creator',
        paneltype: 'modal',
        theme: "success",
        headerTitle: 'Create a New DataSet',
        draggable: true,
        headerControls: {maximize: "remove"},
        contentSize: {
          width: 400,
          height: 205
        },
        onclosed: this.closeThis,
        resizeit:false
      },
      dataset: {
        datasetName: '',
        createTime: '',
        datasetDescription: '',
        creatorId: ''
      }
    }
  },
  components: { JPanel },
  methods: {
    closeThis() {
      this.$emit('close');
    },
    saveProject() {
      if(this.dataset.datasetName==='default'){
        vIziToast.warning('Name "default" is reserved for system! Please change your dataset name.');
        return;
      }
      this.axios({
        url:'/dataSet/create',
        method:'post',
        data:this.dataset
      }).then(response=>{
        if (response.data.msg === "success"){
          vIziToast.success('DataSet ' + this.dataset.datasetName + ' created!');
          this.$store.dispatch(actionTypes.DATASET_REFRESH);
          this.closeThis();
        }
      }).catch(err=>{
        vIziToast.error(err.response.data.msg);
      })
    }
  },
  computed: {
    show() {
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
