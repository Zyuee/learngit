<template>
  <div ref="panlocation"
       class="ol-unselectable ol-control">
    <button type="info"
            title="go to my position"
            @click="pan2Location"
            @touchstart="pan2Location">
      <icon type="md-locate"></icon>
    </button>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { vIziToast } from '../../js/notify/v-iziToast.js'
  import { ViewAnimate } from './js/view-animate.js'

  export default {
    name: 'pan-location',
    data() {
      return {}
    },
    computed: {
      ...mapState({
        basemap: state => state.basemap,
        geolocation: state => {
          try {
            return state.MapState.geolocation;
          } catch (error) {
//             console.log(error);
            return null;
          }
        }
      })
    },
    methods: {
      pan2Location() {
        if (this.geolocation) {
          let position = this.geolocation.getPosition();
          ViewAnimate.flyTo(this.basemap.getView(), position, function () {});
        }
        else {
          vIziToast.warning('Please allow browser\'s geolocation function first');
        }
      }
    }
  }

</script>
