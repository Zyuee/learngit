<template>
  <div>
    <div class="toolbar ol-unselectable ol-control ol-bar">
      <query-control></query-control>
      <select-control></select-control>
      <pan-location></pan-location>
      <draw-control></draw-control>
      <close-control></close-control>
      <upload-shape-toolbar></upload-shape-toolbar>
      <!--<test-control></test-control>-->
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  // import MapUtils from '@/js/ol/utils.js'
  // import { extControls } from '@/js/ol/controls.js'
  import SelectControl from './SelectControl'
  import PanLocation from './PanToLocation'
  import DrawControl from './DrawControl.vue'
  import CloseControl from './CloseAllLayersControl.vue'
  import TestControl from './TestControl.vue'
  import UploadShapeToolbar from './UploadShapeToolbar'
  import QueryControl from  './QueryControl'
  /**
   * 地图工具栏
   * @author houzhiwei
   */
  export default {
    name: 'map-toolbar',
    data(){
      return {
      }
    },
    methods: {},
    computed: {
      ...mapState({
        basemap: state => state.basemap
      }),
      ...mapGetters([ 'vector' ])
    },
    mounted() {
      // ol3-ext 控件组
      /*
       let bar = new ol.control.Bar();
       //触发addMapControl action
       this.$store.dispatch('addMapControl', bar);
       // Edit control bar
       var editbar = new ol.control.Bar({ toggleOne: true, group: false });
       bar.addControl(editbar);
       editbar.addControl(extControls.selectCtrl(this.vector));
       editbar.addControl(extControls.pointCtrl(this.vector));
       editbar.addControl(extControls.lineStringCtrl(this.vector));
       editbar.addControl(extControls.polygonCtrl(this.vector));
       editbar.addControl(extControls.saveCtrl(this.vector));
       */
      // bar.addControl(new ol.control.FullScreen());
    },
    components: {
      QueryControl, SelectControl, PanLocation,DrawControl, CloseControl,TestControl,UploadShapeToolbar
    },
    props: {}
  }
</script>

<style lang="scss">
  @import '../../assets/scss/widgets.scss';
  @import 'scss/ol3-custom';

  @media(max-width: 340px) {
    .toolbar {
      display: none;
    }
  }


</style>
