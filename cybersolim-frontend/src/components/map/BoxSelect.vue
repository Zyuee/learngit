<!--
@see http://openlayers.org/en/latest/examples/box-selection.html
-->
<template>
  <div ref="boxselection"
       class="box-selection ol-unselectable ol-control">
    <button type="info"
            title="drag a box to select features inside"
            @click="boxselect"
            @touchstart="boxselect">
      <Icon type="md-checkbox-outline"/>
    </button>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {Select,DragBox} from 'ol/interaction'
  import {click} from 'ol/events/condition'
  import * as IziToast from '../../js/notify/v-iziToast.js'
  import MapUtils from './js/utils.js'

  export default {
    name: 'box-select',
    data() {
      return {
        active: false, // is this tool active
        vectorSource: {}
      }
    },
    components: {},
    methods: {
      getVectorSource() {
        // get vector source layer which contains all study areas to be selected by boxselect
        this.vectorSource = MapUtils.getLayerByName(this.basemap, 'studyAreas'); //TODO there is no vector layer named "studyAreas" right now
      },
      boxselect() {
        // activate dragbox if it's inactive,
        // inactivate it if it is active
        this.active = !this.active;
        if (this.active) {
          let select = new Select(); // select for highlighting.
          this.$store.dispatch('addMapInteraction', select); // add interaction to map
          let selectedFeatures = select.getFeatures();
          var dragBox = new DragBox({
            condition: click //事件为单击事件时
          });
          this.$store.dispatch('addMapInteraction', dragBox);
          dragBox.on('boxend', function () {
            // features that intersect the box are added to the collection of
            // selected features
            let info = [];
            let extent = dragBox.getGeometry().getExtent();
            this.vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
              selectedFeatures.push(feature);
              info.push(feature.get('name'));
            });
            if (info.length > 0) {
              infoBox.innerHTML = info.join(', ');
            }
          });
          // clear selection when drawing a new box and when clicking on the map
          dragBox.on('boxstart', function () {
            selectedFeatures.clear();
            infoBox.innerHTML = '&nbsp;';
          });
        }
      }
    },
    computed: {
      ...mapState({
        basemap: state => state.basemap
      })
    }
  }
</script>

<style lang="scss">
  .box-selection {

  }

  .ol-dragbox {
    background-color: rgba(255, 255, 255, 0.4);
    border-color: rgba(100, 150, 0, 1);
  }
</style>
