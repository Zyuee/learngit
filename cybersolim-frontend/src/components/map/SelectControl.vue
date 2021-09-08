<template>
  <div class="ol-toggle ol-button ol-unselectable ol-control"
       :class="{'ol-active':active}">
    <button ref="selectBtn"
            type="info"
            title="Select"
            @click="selectFeature">
      <Icon type="md-hand"></Icon>
    </button>
    <div v-if="active"
         class="ol-unselectable ol-control ol-bar ol-option-bar">
      <div class="ol-text-button ol-button ol-unselectable ol-control">
        <button type="info"
                class="ol-text-button"
                @click="delFeature"
                title="Delete">
          <Icon type="md-close"></Icon>
        </button>
      </div>
      <div class="ol-text-button ol-button ol-unselectable ol-control">
        <button type="info"
                @click="showFeature"
                title="Show information">
          <Icon type="md-information-circle"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import Select from 'ol/interaction/Select'
  import {mapState} from 'vuex'
  import MapUtils from './js/utils.js'
  import {click, pointerMove, altKeyOnly} from 'ol/events/condition';
  import {vIziToast} from "@/js/notify/v-iziToast";
  import {Style, Fill, Stroke, Circle, Text} from 'ol/style'

  /**
   * select and delete features or show features' information
   * @see http://www.acuriousanimal.com/thebookofopenlayers3/chapter07_07_editing_features.html
   * @see http://viglino.github.io/ol3-ext/examples/map.control.editbar.html
   */
  export default {
    name: 'select-control',
    data() {
      return {
        active: false,
        select: null,
        selectedFeatures: [],
        popup: null
      }
    },
    methods: {
      styleFunction(feature, isSelect) {
        let _name = "",
          _color = "rgba(255, 255, 255, 0.8)";
        if (isSelect === true) {
          _name = feature.get("NAME");
          _color = '#ffff00a3';//"rgba(255, 0, 0, 0.8)";
        }
        _name = this.basemap.getView().getZoom() > 4 ? _name : "";
        return new Style({
          fill: new Fill({
            color: _color
          }),
          stroke: new Stroke({
            color: '#319FD3',
            width: 1
          }),
          text: new Text({
            text: _name,
            font: '12px Calibri,sans-serif',
            fill: new Fill({
              color: '#000'
            }),
            stroke: new Stroke({
              color: 'red',
              width: 3
            }),
            offsetX: "0"
          })
        });
      },
      selectFeature() {
        this.active = !this.active;
        // a normal select interaction to handle click
        if (this.select === null) {
          this.select = new Select({
            layers: [this.vector],
            style: (feature) => {
              return this.styleFunction(feature, true);
            }
          });
          this.select.on('select', (e) => {
            // let features = e.selected;
            // let geometry = features[0].getGeometry();
            // let coordinates = geometry.getCoordinates();
          });
          // add to map
          this.basemap.addInteraction(this.select);
        }
      },
      delFeature() {
        let features = this.select.getFeatures();

        let len = features.getLength();
        if (len === 0)
          vIziToast.warning("这个功能还要吗？？");
        else {
          features.forEach(item => {
            this.vector.getSource().removeFeature(item);
          });
		     //必须清除选择，不然地图上仍然会显示选中的图形
		     this.select.getFeatures().clear();
		     vIziToast.info(len + " object(s) deleted.");
        }
      },
      showFeature() {
        let features = this.select.getFeatures();
        switch (features.getLength()) {
          case 0:
            vIziToast.warning("Select an object first...");
            break;
          case 1:
            let f = features.item(0);
            vIziToast.success("Selection " + f.get("NAME") + "  is a " + f.getGeometry().getType());
            break;
          default:
            vIziToast.info(features.getLength() + " objects selected.");
            break;
        }
      },
    },
    computed: {
      ...mapState({
        // 获取矢量层
        vector: state => {
          return MapUtils.getVectorLayer(state.basemap);
        },
        basemap: state => state.basemap
      })
    },
    mounted() {
      /*
      let opt_options = this.options;
      let _this = this;
      _this.selectControl = function (opt_options) {
          let _options = opt_options || {};

          ol.control.Control.call(this, {
              element: _this.$refs.selectBtn,
              target: _options.target
          });
      }
      ol.inherits(selectControl, ol.control.Control);
      */
    }
  }
</script>

<style lang="scss">

</style>
