/**
 * Created by houzhiwei on 2017/4/30.
 * BaseLayers 类
 */
import {Group as LayerGroup, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {OSM, Stamen, BingMaps, Vector as VectorSource} from 'ol/source'
import {Style,Fill,Stroke,Circle} from 'ol/style'
import Popup from 'ol-ext/overlay/Popup'

export default class BaseLayers {
  /**
   * group base layers together
   * @param {Array} layers
   * @returns {ol.layer.Group}
   */
  static BaseLayersGroup(layers) {
    return new LayerGroup({
      title: 'Base Layers',
      allwaysOnTop: true,
      openInLayerSwitcher: true, // used to code the visibility of the sublayers.
      layers: layers
    });
  }

  /**
   * Gets an OSM map layer
   * static method
   * @param {Boolean} isBaselayer
   * @param {Boolean} isVisible
   * @returns {ol.layer.Tile}
   */
  static OSMLayer(isBaselayer, isVisible) {
    return new TileLayer(
      {
        title: "OSM",
        baseLayer: isBaselayer,
        source: new OSM(),
        visible: isVisible
      });
  }

  /**
   * Gets an Stamen map layer
   * @param layerName StamenLayerTypes
   * @param {Boolean} isBaselayer
   * @param {Boolean} isVisible
   * @returns {ol.layer.Tile}
   */
  static StamenLayer(layerName, isBaselayer, isVisible) {
    return new TileLayer({
      title: upperCaseFirst.call(this, layerName), // call private method
      baseLayer: isBaselayer,
      source: new Stamen({
        layer: layerName
      }),
      visible: isVisible
    });
  }

  /**
   * Bing map layer
   * @param layerName
   * @returns {ol.layer.Tile}
   */
  static BingMapLayer(layerName) {
    let apiKey = 'AmSNBECNoG2887KQ6gs5IRDmL0F0x4sBH5kKfTDee4DaEBQPieE8QbIuyy2x-pg_';
    let bingLayer = new TileLayer({
      preload: Infinity,
      baseLayer: true,
      title: upperCaseFirst.call(this, layerName),
      visible: true,
      source: new BingMaps({
        key: apiKey,
        imagerySet: layerName
      })
    });
    return bingLayer;
  }

  /**
   * create a vector layer for edit
   * @returns {ol.layer.Vector}
   * 将这个图层置于最顶层，通过zIndex设置
   */
  static VectorLayer() {
    return new VectorLayer({
      title: 'Vector',
      name: 'baseVectorLyr',
      baseLayer: false,
      source: new VectorSource(),
      zIndex: 9999,
      style: new Style({
        fill: new Fill({
          color: 'rgba(0, 255, 0, 0.5)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    });
  }

  static PopupLayer(){
    //添加全局弹出层，用于显示查询信息
    return new Popup({
      popupClass: 'default anim',
      closeBox: true,
    });
  }
}
//---- 静态属性 ----//

//
BaseLayers.BingMapLayerTypes = {
  Road: 'Road',
  Aerial: 'Aerial',
  AerialWithLabels: 'AerialWithLabels',
  collinsBart: 'collinsBart',
  ordnanceSurvey: 'ordnanceSurvey'
};

// http://maps.stamen.com
BaseLayers.StamenLayerTypes = {
  Watercolor: 'watercolor',
  Terrain: 'terrain',
  Toner: 'toner'
};

/**
 * Uppercase the first letter
 * （this is a private method）
 * @param {String} str
 * @returns {string}
 */
function upperCaseFirst(str) {
  return str[0].toUpperCase() + str.substring(1);
}
