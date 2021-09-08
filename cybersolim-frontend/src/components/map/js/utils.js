/**
 * openlayers 地图操作
 */
import {Group as LayerGroup, Vector as VectorLayer} from 'ol/layer'
import proj4 from 'proj4'
import {get as getProjection, transform} from 'ol/proj';
import {register} from 'ol/proj/proj4';

const WGS84_PROJ4 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

const mapUtils = {
  async fetchProj4Def(epsgCode) {
    let proj4Resp = await fetch('https://epsg.io/?format=json&q=' + epsgCode).then(function (response) {
      return response.json();
    });
    return proj4Resp.results[0]['proj4'];
  },
  /**
   * 转换地图坐标到指定坐标系坐标
   * @param map
   * @param mapCoordinate
   * @param dstEpsg 目标 epsg 代码， 如 4326
   */
  transformMapCoordinate(map, mapCoordinate, dstEpsg) {
    let mapProj = map.getView().getProjection();
    let dstProj4Def;
    if (dstEpsg === 4326) {
      proj4.defs('EPSG:4326', WGS84_PROJ4);
    } else {
      dstProj4Def = mapUtils.fetchProj4Def(dstEpsg);
      proj4.defs('EPSG:' + dstEpsg, dstProj4Def);
    }
    register(proj4);
    let dstProj = getProjection('EPSG:' + dstEpsg);
    return transform(mapCoordinate, mapProj, dstProj);
  },
  toWgs84LatLong(map, mapCoordinate) {
    let mapProj = map.getView().getProjection();
    proj4.defs('EPSG:4326', WGS84_PROJ4);
    register(proj4);
    let wgs84 = getProjection('EPSG:4326');
    return transform(mapCoordinate, mapProj, wgs84);
  },
  /**
   * 将坐标点转换为地图坐标
   * @param map
   * @param coordinate 待转换的坐标
   * @param srcEpsg 源epsg
   * @returns {*}
   */
  transform2MapCoordinate(map, coordinate, srcEpsg) {
    let mapProj = map.getView().getProjection();
    let srcProj4Def;
    if (srcEpsg === 4326) {
      proj4.defs('EPSG:4326', WGS84_PROJ4);
    } else {
      srcProj4Def = mapUtils.fetchProj4Def(srcEpsg);
      proj4.defs('EPSG:' + srcEpsg, dstProj4Def);
    }
    register(proj4);
    let srcProj = getProjection('EPSG:' + srcEpsg);
    return transform(coordinate, srcProj, mapProj);
  },
  /**
   * 获取图层
   * @param {ol.Map} map
   * @param {string} name
   * @see http://stackoverflow.com/questions/31297721/how-to-get-a-layer-from-a-feature-in-openlayers-3
   * @see https://gis.stackexchange.com/questions/123234/get-single-layer-in-openlayers-3
   */
  getLayerByName: function (map, name) {
    let l;
    map.getLayers().forEach(layer => {
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach(slayer => {
          if (slayer.get('name') === name)
            l = slayer;
        });
      } else {
        if (layer.get('name') === name)
          l = layer;
      }
    });
    return l;
  },
  /**
   * get (the only) vector layer from map
   * @param {ol.Map} map
   */
  getVectorLayer: function (map) {
    let vector;
    map.getLayers().forEach(layer => {
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach(slayer => {
          if (slayer instanceof VectorLayer)
            vector = slayer;
        });
      } else {
        if (layer instanceof VectorLayer) {
          vector = layer;
        }
      }
    });
    return vector;
  },
  /**
   * get baseVectorLyr from map
   * @param map {ol.Map}
   */
  getBaseVectorLyr: function (map) {
    let name = 'baseVectorLyr';
    let lyr;
    map.getLayers().getArray().forEach(layer => {
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach(slayer => {
          if (slayer.get('name') === name)
            lyr = slayer;
        });
      } else {
        if (layer.get('name') === name)
          lyr = layer;
      }
    });
    return lyr;
  }
};

export default mapUtils;
