import TileLayer from 'ol/layer/Tile'
import {Vector as VectorLayer} from 'ol/layer'
import {TileWMS, Vector as VectorSource} from 'ol/source'
import {KML, GeoJSON} from 'ol/format'
import {get as getProjection, transform} from 'ol/proj';
import {register} from 'ol/proj/proj4';
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import {Circle, Fill, Style, Stroke, IconImage} from 'ol/style'
import {modelingConst} from '../../constVariable'
import proj4 from 'proj4'
import {ViewAnimate} from '../../map/js/view-animate.js'
import {all as allStrategy} from 'ol/loadingstrategy';
import {vIziToast} from "../../../js/notify/v-iziToast";
import * as actionTypes from '../../../store/action-types'
import store from '../../../store'

const WGS84_PROJ4 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

register(proj4);

const mapLayers = {

  //加载图例
  getLegendUrl(layer){
    //获取后台的图例url
    return layer.getSource().getGetFeatureInfoUrl(
      [113.11, 23.5],
      modelingConst.QUERY_RESOLUTION,
      'EPSG:4326',
      {
        'REQUEST': 'GetLegendGraphic'
      }
    );
  },

  /**
   * load mapserver raster map to openlayers
   * @param rasterId rasterFile id
   * @param baseMap baseMap
   * @param _vueThis "this" of vue component
   * @returns {Promise<void>}
   */
  async loadRasterMap(rasterId, baseMap, _vueThis) {
    let resp = await _vueThis.$http.get("/dataLayer/findRaster?layerId=" + rasterId);
    let rasterFile = resp.data.data;
    // null
    if (!rasterFile) {
      vIziToast.error("No map data available");
    }
    let relativePath = rasterFile['rasterFilePath'];
    let top = rasterFile['boundaryUp'];
    let down = rasterFile['boundaryDown'];
    let left = rasterFile['boundaryLeft'];
    let right = rasterFile['boundaryRight'];
    let epsg = rasterFile['rasterAuthSrid'];
    let centerPoint = [(left + right) / 2, (top + down) / 2];
    this.createAndLoadRasterMap(centerPoint, epsg, baseMap, _vueThis, relativePath);
  },
  async loadVectorMap(vectorId, baseMap, _vueThis){
    let resp = await _vueThis.$http.get("/dataLayer/findVector?layerId=" + vectorId);
    let shapefile = resp.data.data;
    let mapPre = this.closeMapLayer(baseMap, shapefile.layerName.split('.')[0]);
    this.loadMapServerWFS(mapPre, shapefile.mapUrl, shapefile.layerName.split('.')[0]);
    _vueThis.$store.dispatch('initMap', baseMap);
  },
  /**
   * create and load raster to openlayers
   * @param centerPoint
   * @param epsg epsg of raster file
   * @param baseMap base map
   * @param _vueThis vue component this
   * @param relativePath raster file relative path
   * @returns {Promise<void>}
   */
  async createAndLoadRasterMap(centerPoint, epsg, baseMap, _vueThis, relativePath) {
    let mapFileRootResp = await _vueThis.$http.post("/map/create?relativeFilePath=" + relativePath);
    let mapFileRoot = mapFileRootResp.data.data;
    let layerName = relativePath.split(".")[0];
    //此处的 this 不是 vue 组件里面的 this
    let mapPre = this.closeMapLayer(baseMap, layerName);
    let map = this.loadMapServerWMS(mapPre, layerName, mapFileRoot);
    _vueThis.$store.dispatch('initMap', map);
    //let proj4Def = await this.findProj4Def(epsg);
    this.layerOrientation(map, centerPoint, epsg);
  },

  loadMapServerWMS(baseMap, layerName, mapFileRoot) {
    let layerSource = new TileWMS({
      url: modelingConst.MAPSERVER,
      params: {
        'layers': layerName,
        'map': mapFileRoot + layerName + '.map',
        WIDTH: 400,
        HEIGHT: 300
      },
      serverType: 'mapserver',
      //跨域问题
      crossOrigin: 'anonymous'
    });
    let newLayer = new TileLayer({
      name: layerName,
      source:layerSource,
      opacity: 0.65
    });
    baseMap.addLayer(newLayer);

    let layerUrl = this.getLegendUrl(newLayer);
    store.dispatch(actionTypes.UPDATE_CURRENT_LEGENT_NAME, layerName.substring(layerName.lastIndexOf('/')+1));
    store.dispatch(actionTypes.UPDATE_CURRENT_LEGENT_URL, layerUrl);

    //需求：当添加图层时，能把获取图片的url传出去，至于图片缩放、放置位置等具体事务有自定义的LegendController组件控制
    //为每一个栅格图层添加显示与否监听器
    newLayer.on('change:visible', function (evt) {
      let layers = baseMap.getLayers().getArray();
      let showLegendLayer = null;
      for (let i = layers.length-1; i >=0; i--){
        //获取顶层显示的图层，需要过滤基础图层
        if (layers[i].get('name') !== undefined && layers[i].get('name') !== 'baseVectorLyr' && layers[i].getVisible()){
          showLegendLayer = layers[i];
          break;
        }
      }
      //如果没有显示的图层，则跳过
      if (showLegendLayer === null || showLegendLayer instanceof VectorLayer) return null;
      //获取后台的图例url
      let showUrl = showLegendLayer.getSource().getGetFeatureInfoUrl(
        [0, 0],
        modelingConst.QUERY_RESOLUTION,
        'EPSG:4326',
        {
          'REQUEST': 'GetLegendGraphic'
        }
      );
      let showName = showLegendLayer.get('name');
      store.dispatch(actionTypes.UPDATE_CURRENT_LEGENT_NAME, showName.substring(showName.lastIndexOf('/')+1));
      store.dispatch(actionTypes.UPDATE_CURRENT_LEGENT_URL, showUrl);
    });

    return baseMap;
  },
  loadWFS(baseMap, url, layerName) {
    let source = new VectorSource({
      format: new GeoJSON(),
      url: url,
      strategy: allStrategy
    });
    let layer = new VectorLayer({
      name: layerName,
      source: source,
      // style: new Style({
      //   image: new Circle({
      //     radius: 5,
      //     fill: new Fill({
      //       color: "#db1a1a",
      //       opacity: 0.5
      //     })
      //   })
      // })
    });
    baseMap.addLayer(layer);
    return baseMap;
  },
  loadMapServerWFS(baseMap, mapUrl, layerName) {
    let url = modelingConst.MAPSERVER + mapUrl;
    return this.loadWFS(baseMap, url, layerName);
  },
  loadKML(baseMap, mappingAreaName, layerName, dataFileRoot) {
    let vector = new VectorLayer({
      name: mappingAreaName,
      source: new VectorSource({
        url: dataFileRoot + layerName,
        format: new KML({extractStyles: false})
      })
    });
    baseMap.addLayer(vector);
    return baseMap;
  },
  closeAllAddedLayer(baseMap) {
    // baseMap.getLayers().forEach(function (layer) {
    //   if (layer.get('name') !== 'baseVectorLyr' && layer.get('name') !== undefined){
    //     console.log(layer.get('name'));
    //     baseMap.removeLayer(layer);
    //   }
    // });
    let layers = baseMap.getLayers().getArray();
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; i < layers.length; j++){
        console.log(layers[j].get('name'));
        if (layers[j].get('name') !== undefined && layers[j].get('name') !== 'baseVectorLyr') {
          baseMap.removeLayer(layers[j]);
          break;
        }
      }
    }
    return baseMap;
  },
  closeMapLayer(baseMap, layerName) {
    baseMap.getLayers().forEach(function (layer) {
      if (layer.get('name') !== undefined && layer.get('name') === layerName) {
        baseMap.removeLayer(layer);
      }
    });
    return baseMap;
  },
  getMapCoordinate(baseMap) {
    return baseMap.getView().getProjection();
  },
  /**
   * fly to the new center
   * @param baseMap base map
   * @param srcCenter center point coordinate
   * @param srcEpsgCode epsg code
   */
  async layerOrientation(baseMap, srcCenter, srcEpsgCode) {
    let dstProj = baseMap.getView().getProjection();
    let srcProjCode = 'EPSG:' + srcEpsgCode;
    let srcProj4Def = await this.findProj4Def(srcEpsgCode);
    proj4.defs(srcProjCode, srcProj4Def);
    register(proj4);
    let srcProj = getProjection(srcProjCode);
    let centerPoint = transform(srcCenter, srcProj, dstProj);
    ViewAnimate.flyTo(baseMap.getView(), centerPoint, function () {
    });
  },
  async findProj4Def(srcEpsgCode) {
    if(srcEpsgCode) {
      if (srcEpsgCode === 4326) {
        return WGS84_PROJ4;
      }
      let proj4Resp = await fetch('https://epsg.io/?format=json&q=' + srcEpsgCode).then(function (response) {
        return response.json();
      });
      return proj4Resp.results[0]['proj4'];
    }else {
      console.error("Invalid EPSG code!");
      return {};
    }
  },
  showSamples(baseMap, samples, layerName, srid) {
    let fields = samples[0].split(',');
    let x_index = fields.indexOf('X');
    let y_index = fields.indexOf('Y');
    let features = [];
    let sum_x = 0;
    let sum_y = 0;
    let authEPSG = "EPSG:" + srid;
    for (let i = 1; i < samples.length - 1; i++) {
      let sample = samples[i].split(",");
      let x = parseFloat(sample[x_index]);
      let y = parseFloat(sample[y_index]);
      sum_x = sum_x + x;
      sum_y = sum_y + y;
      let centerPoint = transform([x, y], authEPSG, "EPSG:3857");
      let feature = new Feature({'geometry': new Point(centerPoint)});
      for (let j = 0; j < fields.length; j++) {
        if (fields[j] !== modelingConst.X && fields[j] !== modelingConst.Y) {
          feature.set(fields[j], sample[j]);
        }
      }
      features.push(feature);
    }
    let style = new Style({
      image: new Circle({
        radius: 10, fill: new Fill(
          {color: 'blue'})
      })
    });
    let vectorSource = new VectorSource({features: features});
    let sampleLayer = new VectorLayer({
      name: layerName,
      source: vectorSource,
      style: style
    });
    baseMap.addLayer(sampleLayer);
    let centerX = sum_x / (samples.length - 2);//需要减去2，减去没有用的字段行
    let centerY = sum_y / (samples.length - 2);
    let centerPoint = transform([centerX, centerY], authEPSG, "EPSG:3857");
    ViewAnimate.flyTo(baseMap.getView(), centerPoint, function () {
    });
    return baseMap;
  },

};


export default mapLayers;
