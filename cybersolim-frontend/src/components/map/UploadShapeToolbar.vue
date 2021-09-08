<template>
  <div class="ol-unselectable ol-control">
    <button type="info" title="upload shape file" @click="showUploadWindow">
      <Icon type="md-cloud-upload"></Icon>
    </button>
<!-- 普通上传   -->
<!--    <shape-load></shape-load>-->
<!--  分块上传  -->
    <shape-upload></shape-upload>
  </div>
</template>

<script>
  import * as actionTypes from '../../store/action-types'
  import { mapState } from 'vuex'
  // import ShapeLoad from '../data/datasets/ShapeLoad'
  import ShapeUpload from "../data/datasets/ShapeUpload";

  export default {
    name: 'upload-shape-toolbar',
    data(){
      return{
        shapeShow:false,
        // showUpload:false,
      }
    },
    components: {
      // ShapeLoad
      ShapeUpload
    },
    methods:{
      showUploadWindow(){
        this.$store.dispatch(actionTypes.SHOW_SHAPE_WINDOW,true)
      },
      closeUpload(){
        this.showUpload =true;
      }
    },
    computed:{

    }
  }
</script>

<style scoped>

</style>
