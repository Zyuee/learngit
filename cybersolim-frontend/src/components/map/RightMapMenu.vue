<template>
  <!--no content needed-->
  <upload-data :show-upload="showUpload" @close="showUpload=false"
               @refresh="refresh"></upload-data>

</template>

<script>
  import * as actionTypes from '../../store/action-types';
  import {vIziToast} from "@/js/notify/v-iziToast";
  import Draw, {createBox} from 'ol/interaction/Draw';
  import ContextMenu from 'ol-contextmenu';
  import {mapState} from 'vuex';
  import 'ol-contextmenu/dist/ol-contextmenu.min.css';
  import {ViewAnimate} from '../map/js/view-animate';
  import proj4 from 'proj4'
  import {register} from 'ol/proj/proj4';
  import {get as getProjection, transform, fromLonLat} from 'ol/proj';
  import MapUtils from "./js/utils";
  import TileLayer from 'ol/layer/Tile'
  import DatasetCreate from '../data/datasets/DatasetCreate'

  import axios from "axios";
  import UploadData from "../data/datasets/UploadData";


  /*
   *  @author houzhiwei
   * 右键处理流程：
   * 1. 右键点击时，获取鼠标点所在位置坐标，或者用户已显示的图层的名称，或者绘制的矩形的四至坐标 （mounted）
   * 2. 根据点坐标、四至坐标、图层名称查询用户拥有的数据 （fetch*Lyrs方法）
   * 3. 若没有可用数据，则提示用户上传研究区数据，可以是矢量多边形或栅格；
   *    若没有可用数据，但用户查询时用的四至坐标（studyArea.length===4），则询问用户是否自动查询并下载相应范围内的 DEM？选择添加到的数据集，填写数据名称
   *    若只有一个可用数据，直接作为研究区
   *    若有多个可用数据，则需要用户进行选择 （modal=true，）
   * 4. 显示建模面板，并显示研究区名称 （modeling()）
   *
   * changeBy Czy 2021.0906
   * 右键修改：
   * 1.快捷上传数据：右键右击时，判断改点是否有数据（DEM），若有则不显示快捷上传，若无数据，则提供快速上传数据功能
   * 2.StudyArea：每次点击功能时，清空之前的兴趣框
   * 3.完成上述任务3：根据四点坐标查询是否存在数据，存在数据的范围，；
   * */
  export default {
    components: {UploadData, DatasetCreate},
    data() {
      return {
        showUpload: false,

        modal: false,
        Eclipse: '',
        Rectangle: '',
        EclipseName: '',
        loading: false,
        vectorLayer: '',
        rasterLayer: '',
        layerType: 'Vector Layer',
        studyAreaLayers: [],
        studyArea: [],
        // studyAreaExtent: {west: 0, north: 0, east: 0, south: 0},
        hasValue: false,
        menuItems: [
          {
            text: '<i class="ivu-icon ivu-icon-md-map" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Loading'
          },
          '-'
        ],
        menuItems2: [
          /* {
             text: '<i class="ivu-icon ivu-icon-md-locate" ' +
               'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
               'Center map here',
             callback: this.center //  callback function
           },*/
          {
            //classname 属性不能正常显示 iview 的图标
            text: '<i class="ivu-icon ivu-icon-ios-create-outline" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Draw Study Area',
            callback: this.draw
          }, {
            text: '<i class="ivu-icon ivu-icon-md-locate" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'upload data',
            callback: this.uploadData//上传数据
          },'-', {
            text: '<i class="ivu-icon ivu-icon-md-map" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Digital Soil Mapping',
            callback: this.dsm
          }, {
            text: '<i class="ivu-icon ivu-icon-md-image" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Terrain Analysis',
            classname: 'right-menu-item',
            callback: this.dta
          }, {
            text: '<i class="ivu-icon ivu-icon-ios-analytics" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              '<div title="Spatially Explicit Integrated Modeling System (SEIMS)">Watershed modeling</div>',
            classname: 'right-menu-item',
            callback: this.seims
          }, {
            text: '<i class="ivu-icon ivu-icon-md-image" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Habitat Suitability Mapping',
            classname: 'right-menu-item',
            callback: this.hsm
          }
        ],
        menuItems3: [
          /* {
             text: '<i class="ivu-icon ivu-icon-md-locate" ' +
               'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
               'Center map here',
             callback: this.center //  callback function
           },*/
          {
            //classname 属性不能正常显示 iview 的图标
            text: '<i class="ivu-icon ivu-icon-ios-create-outline" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Draw Study Area',
            callback: this.draw
          }, '-', {
            text: '<i class="ivu-icon ivu-icon-md-map" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Digital Soil Mapping',
            callback: this.dsm
          }, {
            text: '<i class="ivu-icon ivu-icon-md-image" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Terrain Analysis',
            classname: 'right-menu-item',
            callback: this.dta
          }, {
            text: '<i class="ivu-icon ivu-icon-ios-analytics" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              '<div title="Spatially Explicit Integrated Modeling System (SEIMS)">Watershed modeling</div>',
            classname: 'right-menu-item',
            callback: this.seims
          }, {
            text: '<i class="ivu-icon ivu-icon-md-image" ' +
              'style="font-size: 16px; position: absolute; top: 5px;left: 0;"></i>' +
              'Habitat Suitability Mapping',
            classname: 'right-menu-item',
            callback: this.hsm
          }
        ]
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        //创建一个初始的右键菜单
        let contextMenu = new ContextMenu({
          width: 200,
          items: this.menuItems,
          defaultItems:false
        });

        //有数据时候显示的右键
        var contextmenuHasData = this.menuItems3;
        //无数据时候显示的右键
        var contextmenuNoData = this.menuItems2;

        this.baseMap.addControl(contextMenu);
        // let coordinate = _this.baseMap.getCoordinateFromPixel(this.map.pixel);


        contextMenu.on('open', function (evt) {
          // var features = _this.baseMap.forEachFeatureAtPixel(evt.pixel, function (ft, l) {
          //   return ft;
          // });
          // if (feature) { // open only on features
          //   contextMenu.enable();
          // } else {
          //   contextMenu.disable();
          // }

          //clear data
          let vectorLayers = [];
          let rasterLayers = [];
          _this.studyAreaLayers = [];
          //click point coordinate 3857
          let coordinate = _this.baseMap.getCoordinateFromPixel(evt.pixel);
          //mapProj
          let mapProj = _this.baseMap.getView().getProjection();
          proj4.defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
          register(proj4);
          let wgs84 = getProjection("EPSG:4326");
          //用于后台查询的点坐标
          let wgs84Point = transform(coordinate, mapProj, wgs84);
          //坐标点
          var PointArray=new Array(wgs84Point)
          //判断是否有数据
          let callUrl = "/dataSet/isExistData?pointExtent=" + PointArray;
          _this.axios({
            url:callUrl,
            method:'get'
          }).then(response => {
            // console.log(response.data)
            if(response.data == 1){
              contextMenu.clear();
              contextMenu.extend(contextmenuHasData);
            }else{
              contextMenu.clear();
              contextMenu.extend(contextmenuNoData);
            }
          })
          _this.studyArea = wgs84Point;
          //用于重新定位视图中心
          _this.menuItems[0].data = {coordinate: coordinate};
          // console.log(menuItems[0]);
          // console.log(menuItems2);


          //获取矢量要素
          let feature = _this.baseMap.forEachFeatureAtPixel(evt.pixel, function (ft, layer) {
            return ft;
          }, {hitTolerance: 20});

          if (feature !== undefined) {
            //获得图形范围坐标并转换为 wgs84 坐标
            let extentTemp = feature.getGeometry().getExtent();

            let leftDown = transform([extentTemp[0], extentTemp[1]], mapProj, wgs84);
            let rightUp = transform([extentTemp[2], extentTemp[3]], mapProj, wgs84);
            // 重新赋值
            _this.studyArea = [leftDown[0], leftDown[1], rightUp[0], rightUp[1]];
            _this.fetchExtentLyrs(leftDown[0], leftDown[1], rightUp[0], rightUp[1]);
            // 传递数据给右键菜单
            _this.menuItems.forEach((item) => {
              if (item !== '-')
                item.data = {feature: feature};
            });
          } else {
            //无矢量要素则读取点击点坐标图层
            // 没有获取到矢量要素，则获取加载的图层
            // 跨域问题：需要加载WMS时加上 crossOrigin: 'anonymous'。但如果服务器没做处理，则会导致无法加载地图
            _this.baseMap.forEachLayerAtPixel(evt.pixel, (lyr) => {
              //不加入 baseLayer
              if (!lyr.get('baseLayer')) {
                //分矢量和栅格
                if (lyr instanceof TileLayer) {
                  rasterLayers.push(lyr.get('name'));
                } else if (lyr.get('name') !== 'baseVectorLyr') {
                  vectorLayers.push(lyr.get('name'));
                }
              }
            });
            // 有图层则根据图层名称查询，没有则根据点坐标查询
            if (vectorLayers.length > 0) {
              //dsm需要这个
              _this.studyArea = vectorLayers[0].getExtent();
              _this.fetchLayersByName(vectorLayers, true);
            } else if (rasterLayers.length > 0) {
              // 根据图层名称获取
              _this.fetchLayersByName(rasterLayers, false);
              //console.log(rasterLayers[0]);
            } else {
              _this.fetchPointLyrs(wgs84Point[0], wgs84Point[1]);
            }
          }
        });

        //单击时关闭右键菜单
        this.baseMap.on('click', function (evt) {
          if (contextMenu.isOpen()) {
            contextMenu.close();
          }
        });
      });
    },
    methods: {

      refresh() {
        this.showDataSetInfo();
        this.showDataSetlayerInfo();
        vIziToast.success('Refreshed', 2000)
      },

      uploadData() {
        this.showUpload = true
      },
      showDataSetInfo() {
        this.axios({
          url: '/dataSet/findDatasetBySetID',
          method: 'get',
          params: {dataSetId: this.dataSetId}
        }).then(response => {
          if (response.data.data) {
            this.dataSet = response.data.data;
          } else {
            console.error("response data is null");
          }
        }).catch(err => {
          console.log(err)
        });
      },
      showDataSetlayerInfo() {
        this.axios({
          url: '/dataSet/findDatasetlayers',
          method: 'get',
          params: {dataSetId: this.dataSetId}
        }).then(response => {
          let data = response.data.data;
          //需要从showlayer获取当前显示的图层
          let layers = this.baseMap.getLayers().getArray();
          let layersList = [];
          for (let j = 0; j < layers.length; j++) {
            if(layers[j].get('name') !== undefined && layers[j].get('visible')){ // 收集已经加载且显示的图层
              let count = layers[j].get('name').split('/').length;
              layersList.push(layers[j].get('name').split('/')[count-1]);
            }
          }
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (layersList.indexOf(data[i].layerName) == -1){//若没有在现有显示的图层中，则赋予show的标志
                data[i].map = 'show';
              }else {
                data[i].map = 'close';
              }
            }
            this.tblData = data;
          } else {
            console.error("response data is null");
          }
        })
      },


      /**
       * 根据用户选择显示建模界面
       */
      modeling(task) {
        if (this.studyAreaLayers.length === 0) {
          if (this.studyArea.length === 4) {
            this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, this.studyArea);
          } else {
            vIziToast.warning("Please select your study area first!");
            return;
          }
        }
        this.$store.dispatch(actionTypes.STUDY_AREA_LAYERS, this.studyAreaLayers);

        switch (task) {
          case "dta":
            this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, true);
            this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, this.studyArea);
            this.$store.dispatch(actionTypes.INIT_METHOD_DOMAIN, "DTA");
            this.$store.dispatch(actionTypes.INIT_TASK_Method, "");
            //this.$store.dispatch(actionTypes.SAVED_MODEL_DOMAIN, "DTA");
            this.$store.dispatch(actionTypes.SAVED_STUDY_AREA, this.studyArea);
            break;
          case "seims":
            this.$store.dispatch(actionTypes.SHOW_SEIMS_MODEL, true);
            break;
          case "dsm":
            //console.log("dsm study area: " + this.studyArea);
            this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, true);
            //state.MapState.clickGeometry
            this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, this.studyArea);
            this.$store.dispatch(actionTypes.INIT_METHOD_DOMAIN, "DSM");
            this.$store.dispatch(actionTypes.INIT_TASK_Method, "Individual_Predictive_Soil_Mapping");
            //this.$store.dispatch(actionTypes.SAVED_MODEL_DOMAIN, "DSM");
            this.$store.dispatch(actionTypes.SAVED_STUDY_AREA, this.studyArea);
            break;
          case "hsm":
            this.$store.dispatch(actionTypes.SHOW_MODEL_BUILDING, true);
            this.$store.dispatch(actionTypes.SELECT_MAPPING_AREA, this.studyArea);
            this.$store.dispatch(actionTypes.INIT_METHOD_DOMAIN, "HSM");
            this.$store.dispatch(actionTypes.INIT_TASK_Method, "Habitat_Mapping");
            //this.$store.dispatch(actionTypes.SAVED_MODEL_DOMAIN, "HSM");
            this.$store.dispatch(actionTypes.SAVED_STUDY_AREA, this.studyArea);
            break;
          default:
            vIziToast.info("We are working on it. Coming soon...");
        }
      },
      /**
       * 设置返回的图层数据到列表
       * 判断是否需要用户选择图层还是自动选择唯一的图层
       * @param data 后端返回的数据
       */
      setLayers(data) {
        //error
        if (!data) {
          vIziToast.error("response data is null or undefined");
          return;
        }
        if (data.length > 0) {
          this.studyAreaLayers = [];
          this.studyAreaLayers = data;
        }
        this.loading = false;
      },
      fetchPointLyrs(lng, lat) {
        this.loading = true;
        let point = {x: lng, y: lat};
        this.$http.get('dataLayer/point/vector', {params: point}).then(resp => {
          this.setLayers(resp.data);// console.log(resp);
        });
        this.$http.get('dataLayer/point/raster', {params: point}).then(resp => {
          this.setLayers(resp.data);// console.log(resp);
        });
        this.loading = false;
      },
      fetchExtentLyrs(west, south, east, north) {
        this.loading = true;
        let extent = {west: west, south: south, east: east, north: north};
        this.$http.get('dataLayer/extent/vector', {params: extent}).then(resp => {
          this.setLayers(resp.data);
        });
        this.$http.get('dataLayer/extent/raster', {params: extent}).then(resp => {
          this.setLayers(resp.data);
        });
      },
      fetchLayersByName(names, isVector) {
        this.loading = true;
        // names 直接传数组是不行的，后端无法识别。转换为字符串
        if (isVector) {
          this.$http.get('dataLayer/vector/names', {params: {names: names + ''}}).then(resp => {
            this.setLayers(resp.data);
          });
        } else {
          this.$http.get('dataLayer/raster/names', {params: {names: names + ''}}).then(resp => {
              //console.log(resp);
              this.setLayers(resp.data);
            }
          );
        }
      },
      draw() {
        this.vectorLyr.getSource().clear();
        // console.log(this.vectorLyr.getSource())
        let draw = new Draw({
          source: this.vectorLyr.getSource(),
          type: 'Circle',
          geometryFunction: createBox()
        });
        let _this = this;
        draw.on('drawend', function (evt) {
          //
          //array，最后一个点坐标和第一个相同
          let geom = evt.feature.getGeometry();
          // console.log(geom.getCoordinates());
          _this.baseMap.removeInteraction(draw);
        });
        this.baseMap.addInteraction(draw);
        // this.$store.dispatch('initMap', this.baseMap);
      },
      center(obj) {
        ViewAnimate.animateCenter(this.baseMap.getView(), obj.coordinate, 1000);
      },
      dsm() {
        this.modeling('dsm');
      },
      dta() {
        this.modeling('dta');
      },
      seims() {
        this.modeling('seims');
      },
      hsm() {
        this.modeling('hsm');
      },
      upload() {
        vIziToast.info("We are working on it. Coming soon...");
      },
      datasetPolygonName(path) {
        //去掉文件夹路径，只取文件名称
        let temp = path.split(".")[0];
        let splits = temp.split("/");
        return splits[splits.length - 1];
      }
    },
    computed: {
      graphType() {
        if (this.rMouseDownType !== null) {
          return this.rMouseDownType.type
        }
      },
      graphName() {
        if (this.rMouseDownType !== null) {
          return this.rMouseDownType.dataName
        }
      },
      hasData() {
        this.rMouseDownType.check();
        if (this.rMouseDownType.hasValue) {
          return true;
        } else {
          return false;
        }
      },
      hasFatherTask() {
        return this.graphManager.checkDataHasFatherTask(this.rMouseDownType);
      },
      ...
        mapState({
          // 获取矢量层
          vectorLyr: state => {
            return MapUtils.getVectorLayer(state.basemap);
          },
          baseMap: state => state.basemap
        }),
    },
    props: {
      target: null
    }
  }
</script>
<style lang="scss" scoped>

  .modal-content {
    padding: 10px;
    .coordinate-content {
    text-align: center;
    }
  }


  .right-menu-item span {
    margin-left: 6px;
  }

  .right-menu {
    position: fixed;
    background: #fff;
    border: solid 1px rgba(0, 0, 0, .2);
    border-radius: 3px;
    z-index: 999;
    display: none;
  }

  .right-menu a {
    width: 150px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
    font-size: 12px;
    border-bottom: solid 0.5px #1d22221c
  }

  .right-menu a:hover {
    background: #eee;
    color: #fff;
  }

  .right-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, .1);
    border-radius: 1px;
  }

  a {
    text-decoration: none;
  }

  .right-menu a {
    padding: 2px;
  }

  .right-menu a:hover {
    background: #42b983;
  }
</style>
