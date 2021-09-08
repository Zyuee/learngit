<template>
  <div class="ol-unselectable ol-control">
    <button type="info" title="draw rectangle" @click="drawRectangle" @touchstart="drawRectangle">
      <Icon type="ios-create" />
    </button>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {Vector as VectorLayer} from 'ol/layer';
  import {Vector as VectorSource, TileWMS} from 'ol/source';
  import {Style, Stroke} from 'ol/style';
  import Draw, {createBox} from 'ol/interaction/Draw'
  import MapUtils from "./js/utils";
  import {vIziToast} from "@/js/notify/v-iziToast";

  export default {
    name: 'draw-control',
    data() {
      return {
        geom:null
      }
    },
    methods: {
      drawRectangle() {
      //   // 增加一个判断和删除，判断是否已有多边形
        let features = this.vectorLyr.getSource().clear();
        // console.log(features);

        //console.log("drawRectangle");
        let start_drawing = false;
        //TODO 确认并清理不必要的代码
        //没必要为绘制的图形新建图层
        //let layerNames = [];
        //let mappingAreaName = '';
        //获取现有图层的名字
       /* this.baseMap.getLayers().forEach(function (layer) {
          if (layer.get('name') !== undefined) {
            layerNames.push(layer.get('name'));
          }
        });*/
        //手动绘制的图层名字采用mapping area + i的形式，例如mapping area 4
        //根据现有图层名称确定即将加入的图层的名称
       /* for (let i = 0; i < 100; i++) {
          let layerName = 'mapping area ' + i;
          if (layerNames.indexOf(layerName) < 0) {
            mappingAreaName = layerName;
          }
        }*/
        //定义图层
        /*let circleLayer = new VectorLayer({
          name: mappingAreaName,
          source: new VectorSource()
        });*/
        //this.baseMap.addLayer(circleLayer);
//        let source = new ol.source.Vector({wrapX: false});
        let draw = new Draw({
          source: this.vectorLyr.getSource(),
          //source: circleLayer.getSource(),
          type: 'Circle',
          geometryFunction: createBox(),
//          condition: ol.events.condition.dblclick
        });
        let map = this.baseMap;
        this.baseMap.addInteraction(draw);
        draw.on('drawstart', function (evt) {
          start_drawing = true;
        });
        draw.on('drawend', function (evt) {
          let geom = evt.feature.getGeometry();
          this.geom = geom;
          // console.log(geom.getCoordinates());
          map.removeInteraction(draw);
        });
        //this.$store.dispatch('initMap', map);
      },
    },
    computed: {
      ...mapState({
        vectorLyr: state => {
          return MapUtils.getVectorLayer(state.basemap);
        },
        baseMap: state => state.basemap
      }),
    },
  }
</script>
