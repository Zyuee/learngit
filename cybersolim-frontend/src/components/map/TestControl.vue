<template>
  <div class="ol-unselectable ol-control">
    <button type="info" title="test" @click="showKML" >
      <Icon type="md-close-circle"></Icon>
    </button>
  </div>
</template>


<script>
  import { mapState } from 'vuex';
  import {Vector as VectorLayer} from 'ol/layer'
  import {Vector as VectorSource} from 'ol/source'
  import {KML} from 'ol/format'
  import mapLayers from './js/showLayers.js'


  export default {
    name: 'draw-control',
    data () {
      return {}
    },
    methods:{
      showKML(){
        let vector = new VectorLayer({
          source:new VectorSource({
            url:"http://localhost/egcDataFiles/39/2/t.kml",
            format:new KML({extractStyles: false})
          })
        });
        this.baseMap.addLayer(vector);
      },

    },
    computed:{
      ...mapState({
        baseMap: state => state.basemap
      }),
    },
  }
</script>
