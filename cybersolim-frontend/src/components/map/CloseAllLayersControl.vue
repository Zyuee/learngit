<template>
  <div class="ol-unselectable ol-control">
    <button type="info" title="close all your layers" @click="closeLayer" >
      <Icon type="md-close-circle" />
    </button>
  </div>
</template>


<script>
  import { mapState } from 'vuex';
  import mapLayers from './js/showLayers.js'
  export default {
    name: 'draw-control',
    data () {
      return {}
    },
    methods:{
      closeLayer(){
        let map = mapLayers.closeAllAddedLayer(this.baseMap);
        this.$store.dispatch('initMap', map);
      },

    },
    computed:{
      ...mapState({
        baseMap: state => state.basemap
      }),
    },
  }
</script>
