<template>
  <div>
    <div id="map">
      <!--  <div id="map" @mousedown="canvasDown($event)">-->
    </div>
    <map-menu :target="mapMenuTarget"></map-menu>
    <!--    <map-menu :target="mapMenuTarget" :mappingArea="mappingArea"></map-menu>-->
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {pointerMove} from 'ol/events/condition';
  import {fromLonLat} from 'ol/proj';
  import Select from 'ol/interaction/Select'
  import {Map, View} from 'ol'
  import Geolocation from 'ol/Geolocation'
  import {controls} from './js/controls.js';
  import BaseLayers from './js/baselayers.js';
  import MapMenu from './RightMapMenu';
  import showLayers from './js/showLayers.js'
  import saveAs from "file-saver"


  export default {
    name: 'base-map',
    data() {
      return {
        search: '',
        geolocation: {},
        mapMenuTarget: null,
        mappingArea: []
      }
    },
    components: {MapMenu},
    updated() {
      // this.mapMenuTarget =document.querySelector("#map");
    },
    methods: {
      addInteraction() {
        let selectSingleClick = new Select({});
        let selectPointerMove = new Select({
          condition: pointerMove
        });
        this.baseMap.addInteraction(selectSingleClick);
        this.baseMap.addInteraction(selectPointerMove);
      },
      initUserData() {
        let hasData = false;
        this.$http.get("/dataLayer/init/polygons").then(resp => {
          if (resp.data.data) {
            hasData = true;
            let polygon = resp.data.data;
            showLayers.loadMapServerWFS(this.baseMap, polygon['url'], polygon['name']);
            showLayers.layerOrientation(this.baseMap, polygon['center'], polygon['epsg'])
          } else {
            this.$http.get("/dataLayer/init/rasters").then(resp => {
              if (resp.data.data) {
                let raster = resp.data.data;
                // console.log(resp.data.data);
                let relativePath = raster['rasterFilePath'];
                let top = raster['boundaryUp'];
                let down = raster['boundaryDown'];
                let left = raster['boundaryLeft'];
                let right = raster['boundaryRight'];
                let epsg = raster['rasterAuthSrid'];
                let centerPoint = [(left + right) / 2, (top + down) / 2];
                showLayers.createAndLoadRasterMap(centerPoint, epsg, this.baseMap, this, relativePath);
              } else {
                console.warn("no initial data available");
              }
            });
          }
        });

      }
      /*
      // 右键功能统一到 RightMapMenu 组件
      canvasDown(e){
         // this.mousePosition = e;
         //todo:可以将feature输出成Geojson，在后台利用多边形找数据
         let map = this.baseMap;
         let extent = [];
         let coord = [];
         this.baseMap.getViewport().addEventListener('contextmenu', (e)=> {
           e.preventDefault();
           coord = map.getCoordinateFromPixel(map.getEventPixel(e));
           let sourceCoordinate = map.getView().getProjection();
           proj4.defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
           register(proj4);
           let proj = new Projection({code:"EPSG:4326"});
           let location =  transform(coord, sourceCoordinate, proj);
           // this.$store.dispatch(actionTypes.SELECT_MAPPING_POINT,newCoord);
           let feature = map.forEachFeatureAtPixel(map.getEventPixel(e),
             function (feature, layer) {
               return feature;
             });
           if (typeof feature === "undefined"){
             extent = location;
           }else {
             let extentTemp = feature.getGeometry().getExtent();
             let leftDown = transform([extentTemp[0], extentTemp[1]], sourceCoordinate, proj);
             let rightUp = transform([extentTemp[2], extentTemp[3]], sourceCoordinate, proj);
             extent = [leftDown[0], leftDown[1], rightUp[0], rightUp[1]];
           }
           this.mappingArea = extent;
           // this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, feature);
         })
         // this.contextMenuTarget = document.querySelector("#map");
         console.log(extent);

       }*/
    },
    computed: {
      // 使用对象展开运算符将 getters 混入 computed 对象中
      ...mapState({
        baseMap: state => state.basemap
      }),
    },
    mounted() {
      // base layers
      let bingMap = BaseLayers.BingMapLayer(BaseLayers.BingMapLayerTypes.AerialWithLabels);
      let stamen_terrain = BaseLayers.StamenLayer(BaseLayers.StamenLayerTypes.Terrain, true, false);
      let osm = BaseLayers.OSMLayer(true, false);
      let baselayerGroup = BaseLayers.BaseLayersGroup([bingMap, stamen_terrain, osm]);
      //  Vector layer (for edit)
      let vector = BaseLayers.VectorLayer();

      let centerPoint = fromLonLat([116.8, 40]);// 默认beijing;

      let view = new View({
        center: centerPoint,
        zoom: 10
      });
      // html5 geolocation 浏览器地理位置定位：根据浏览器地理位置定位地图中心点
      this.geolocation = new Geolocation({
        projection: view.getProjection(),
        tracking: true
      });
      let popupLayer = BaseLayers.PopupLayer();
      // 监听点击事件，设置图片保存事件
      controls.print.on(['print', 'error'], (e) => {
        e.canvas.toBlob((blob => {
          saveAs(blob, 'map' + e.imageType.replace('image/', ''))
        }), e.imageType)
      });

      let map = new Map({
        target: 'map',
        layers: [
          baselayerGroup, vector
        ],
        overlays: [popupLayer],
        controls: [controls.zoom, controls.overview, controls.attr, controls.scale, controls.switcher],
        loadTilesWhileInteracting: true,
        view: view
      });

      // 触发action方法initMap，初始化根状态中的地图对象
      this.$store.dispatch('initMap', map);
      this.$store.dispatch('initGeolocation', this.geolocation);
      this.$store.dispatch('addPopupLayer', popupLayer)
      this.initUserData();
      this.mapMenuTarget = document.querySelector("#map");

      let url = map.getLayers().getArray();
      //console.log(url);
    }
  }
</script>
<style lang="scss" scoped>
  #map {
    height: calc(100% - 3rem);
    width: 100%;
    position: fixed; // required
  }
</style>
