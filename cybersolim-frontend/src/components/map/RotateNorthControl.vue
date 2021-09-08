<template>
  <div ref="rotatenorth"
       class="rotate-north ol-unselectable ol-control">
    <button type="info"
            @click="handleRotateNorth"
            @touchstart="handleRotateNorth"> N
    </button>
  </div>
</template>

<script>
  import {inherits} from 'ol'
  import {Control} from 'ol/control'
  // rotate map north control
  // example of custom control
  export default {
    name: 'rotate-north-control',
    data() {
      return {
        _options: {}
      }
    },
    props: {
      basemap: {type: Object, required: true}, // ol.map
      options: {
        type: Object, default() {
          return {};
        }
      },
      angle: 0
    },
    methods: {
      handleRotateNorth() {
        this.basemap.getView().setRotation(this.angle);
      }
    },
    mounted() {
      this._options = this.options;
      let RotateNorthControl = function () {
        let optOptions = this._options || {};
        let element = this.$refs.rotatenorth;

        Control.call(this, {
          element: element,
          target: optOptions.target
        });
      };
      inherits(RotateNorthControl, Control);
      this.basemap.addControl(RotateNorthControl);
    }
  }
</script>

<style lang="scss">

</style>
