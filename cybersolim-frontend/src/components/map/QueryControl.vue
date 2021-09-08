<template>
  <div ref="queryinfo"
       class="ol-toggle ol-unselectable ol-control"
       :class="{'ol-active':active}">
    <button type="info"
            title="query layer information"
            @click="queryLayerInfo">
      <Icon type="md-alert" />
    </button>
  </div>
</template>

<script>
  import {modelingConst} from '../constVariable'
  import {mapState} from 'vuex'
  import {toLonLat} from 'ol/proj';
  import {unByKey} from 'ol/Observable'
  import ol_ext_element from 'ol-ext/util/element'
  import {Vector as VectorLayer } from 'ol/layer'

  export default {
    name: "query-control",
    data() {
      return {
        active: false,
        clickEvent: null,
      }
    },
    methods: {
      queryLayerInfo(){
        this.active = !this.active;
        if (this.active){
          this.clickEvent = this.basemap.on('singleclick', this.mapSingleClick);//捆绑监听事件
        }else {
          this.removeQueryListener();
        }

      },
      removeQueryListener(){
        if (this.clickEvent !== null){
          this.popup.hide();
          unByKey(this.clickEvent);//取消监听事件
          this.clickEvent = null;
        }
      },
      mapSingleClick(evt) {
        //当前只能查询栅格图层
        let layers = this.basemap.getLayers().getArray();
        //将投影坐标转为地理坐标，方法1
        // let mapProj = this.basemap.getView().getProjection();
        // let coordinate = this.basemap.getCoordinateFromPixel(evt.pixel);
        // proj4.defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
        // register(proj4);
        // let wgs84 = getProjection("EPSG:4326");
        // let wgs84Point = transform(coordinate, mapProj, wgs84);
        //将投影坐标转为地理坐标，方法2
        let coordinate = toLonLat(evt.coordinate);
        let infoModel = {'longitude': coordinate[0].toFixed(5), 'latitude': coordinate[1].toFixed(5)};//用于存储多个栅格图层的像素值对象
        for (let i = 0; i < layers.length; i++) {
          //挑选出可以查询的图层
          if (layers[i].get('name') !== undefined && layers[i].get('name') !== 'baseVectorLyr' && layers[i].getVisible() && !(layers[i] instanceof VectorLayer)) {
            let url = layers[i].getSource().getGetFeatureInfoUrl(
              coordinate,
              modelingConst.QUERY_RESOLUTION,
              'EPSG:4326',
              {
                'INFO_FORMAT': 'text/html',
                'QUERY_LAYERS': layers[i].get('name')
              }
            );
            // console.log(url);
            $.ajax({
              type: 'GET',
              url: url,
              async: false,
              success: function (res) {
                let el = document.createElement('html');
                el.innerHTML = res;
                let tr = el.getElementsByTagName('td');
                if (tr.length > 0){
                  infoModel[tr[0].innerText] = tr[1].innerText;
                }
              }
            });
          }
        }
        // console.log(infoModel);
        let htm = this.getShowContent(infoModel);
        this.popup.show(evt.coordinate, htm);
      },
      getShowContent(infoModel){
        if (!infoModel) return '';
        let html = ol_ext_element.create('DIV', { className: 'ol-popupfeature' });
        // 标题
        let title = 'Layer Information: ';
        ol_ext_element.create('H3', { html:title, parent: html });
        // 显示表格
        if (infoModel) {
          let tr, table = ol_ext_element.create('TABLE', { parent: html });
          for (let field in infoModel) {
            let value = infoModel[field];
            //判断值是什么类型(整数？浮点数？字符串)
            if (this.isNumber(value) && this.isInteger(value)){
              value = parseInt(value);
            }else {
              value = parseFloat(value).toFixed(4);
            }
            tr = ol_ext_element.create('TR', { parent: table });
            //字段名
            ol_ext_element.create('TD', {
              html: field.substring(field.lastIndexOf('/')+1),
              parent: tr
            });
            //值
            ol_ext_element.create('TD', {
              html: value,
              parent: tr
            });
          }
        }
        return html;
      },
      isNumber(val){
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
          return true;
        }else{
          return false;
        }
      },
      isInteger(n){
        return parseInt(n) == parseFloat(n)
      }
    },
    computed: {
      ...mapState({
        basemap: state => state.basemap,
        popup: state => state.popupLayer
      })
    },
  }
</script>

<style scoped>

</style>
