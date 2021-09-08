/**
 * 地图控件
 * 方便使用
 */
import {OverviewMap, ZoomSlider, Zoom, ScaleLine, FullScreen, Attribution, MousePosition} from 'ol/control'
import Bar from 'ol-ext/control/Bar'
import {defaults} from 'ol/control'
import TextButton from 'ol-ext/control/TextButton'
import Toggle from 'ol-ext/control/Toggle'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'
import {Select, Draw} from 'ol/interaction'
import {vIziToast} from '@/js/notify/v-iziToast'
import Print from 'ol-ext/control/Print'

/**
 * ol 自带控件
 */
export const controls = {
  // 鹰眼图
  overview: new OverviewMap({
    collapsed: true
  }),
  // 缩放滑块
  zoomSlider: new ZoomSlider({
    duration: 800
  }),
  // 缩放
  zoom: new Zoom({
    duration: 800,
    className: 'control-right'
  }),
  // 比例尺
  scale: new ScaleLine({
    className: 'scale-left ol-scale-line'
  }),
  // 地图版权
  attr: new Attribution({
    className: 'attr-right ol-attribution'
  }),
  // 鼠标位置
  mousePosition: new MousePosition(),
  fullScreen: new FullScreen(),
  // 地图图层切换
  switcher: new LayerSwitcher({
    show_progress: true,
    extent: true,
    // trash: true // 删除按钮
  }),
  //打印控件
  print: new Print({
    imageType: 'image/png'
  }),
  // 默认控件（）
  default: defaults() // 没有new
};

/**
 * ol3-ext controls
 * Unused now!
 * @see http://viglino.github.io/ol3-ext/examples/map.control.editbar.html
 */
export const extControls = {
  // Edit control bar
  editbar: new Bar({
    toggleOne: true, // one control active at the same time
    group: false // group controls together
  }),
  // Add selection tool (a toggle control with a select interaction)
  selectCtrl: (vector) => {
    var sbar = new Bar();
    var deleteBtn = new TextButton({
      html: '<i class="ivu-icon ivu-icon-close"></i>',
      title: "Delete",
      handleClick: function () {
        var features = selectCtrl.getInteraction().getFeatures();
        if (!features.getLength()) {
          vIziToast.info('Select an object first...')
        } else {
          vIziToast.info(features.getLength() + " object(s) deleted.")
        }
        for (var i = 0, f; f = features.item(i); i++) {
          vector.getSource().removeFeature(f);
        }
        selectCtrl.getInteraction().getFeatures().clear();
      }
    });

    var infoBtn = new TextButton({
      html: '<i class="ivu-icon ivu-icon-information"></i>',
      title: "Show informations",
      handleClick: function () {
        switch (selectCtrl.getInteraction().getFeatures().getLength()) {
          case 0:
            // info("Select an object first...");
            break;
          case 1:
            var f = selectCtrl.getInteraction().getFeatures().item(0);
            // info("Selection is a " + f.getGeometry().getType());
            break;
          default:
            // info(selectCtrl.getInteraction().getFeatures().getLength() + " objects seleted.");
            break;
        }
      }
    });
    sbar.addControl(deleteBtn);
    sbar.addControl(infoBtn);
    var selectCtrl = new Toggle({
      html: '<i class="ivu-icon ivu-icon-android-hand"></i>',
      title: "Select",
      interaction: new Select(),
      bar: sbar,
      active: true
    });
    return selectCtrl;
  },
  // Add editing tools
  pointCtrl: (vector) => {
    var pedit = new Toggle({
      html: '<i class="ivu-icon ivu-icon-ios-location-outline"></i>',
      title: 'Point',
      interaction: new Draw({
        type: 'Point',
        source: vector.getSource()
      })
    });
    return pedit;
  },
  lineStringCtrl: (vector) => {
    var ledit = new Toggle({
      html: '<i class="ivu-icon ivu-icon-merge" ></i>',
      title: 'LineString',
      interaction: new Draw({
        type: 'LineString',
        source: vector.getSource()
      }),
      // Options bar associated with the control
      bar: new Bar({
        controls: [new TextButton({
          html: 'undo',
          title: "Delete last point",
          handleClick: () => {
            ledit.getInteraction().removeLastPoint();
          }
        }),
          new TextButton({
            html: 'Finish',
            title: "finish",
            handleClick: () => { // Prevent null objects on finishDrawing
              var drawi = ledit.getInteraction();
              var lkey = drawi.on('drawend', function (e) {
                drawi.unByKey(lkey);
                var c = e.feature.getGeometry().getCoordinates();
                if (c.length < 2) {
                  throw "Bad LineString";
                }
              });
              try {
                drawi.finishDrawing();
              } catch (e) {
                drawi.unByKey(lkey);
              }
            }
          })
        ]
      })
    });
    return ledit;
  },
  polygonCtrl: (vector) => {
    var polygonEdit = new Toggle({
      html: '<i class="ivu-icon ivu-icon-compose"></i>',
      title: 'Polygon',
      interaction: new Draw({
        type: 'Polygon',
        source: vector.getSource()
      }),
      // Options bar ssociated with the control
      bar: new Bar({
        controls: [new TextButton({
          html: 'undo', //'<i class="fa fa-mail-reply"></i>',
          title: "undo last point",
          handleClick: () => {
            polygonEdit.getInteraction().removeLastPoint();
          }
        }),
          new TextButton({
            html: 'finish',
            title: "finish",
            handleClick: () => { // Prevent null objects on finishDrawing
              var drawi = polygonEdit.getInteraction();
              var lkey = drawi.on('drawend', function (e) {
                drawi.unByKey(lkey);
                var c = e.feature.getGeometry().getCoordinates();
                if (c[0].length < 4) {
                  throw "Bad Polygon";
                }
              });
              try {
                drawi.finishDrawing();
              } catch (e) {
                drawi.unByKey(lkey);
              }
            }
          })
        ]
      })
    });
    return polygonEdit;
  },
  saveCtrl: (vector) => {
    return new TextButton({
      html: '<i class="ivu-icon ivu-icon-ios-download"></i>',
      title: "Save",
      handleClick: function (e) {
        var json = new GeoJSON().writeFeatures(vector.getSource().getFeatures());
        // info(json);
      }
    })
  }
};
