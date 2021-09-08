<template>
  <div>
    <j-panel :options="panelOptions" :show="show" class="data-modal">
      <Form>
        <Form-item label="Name" :label-width="80">
          <Input type="text" placeholder="data name" v-model="formItem.dataName"></Input>
        </Form-item>
        <Form-item>
          <Upload
            ref="upload"
            :show-upload-list="false"
            multiple
            action="//"
            :format="['shp','shx','.dbf','prj','sbn','sbx']"
            :before-upload="handleBeforeUpload"
            :on-format-error="handleFormatError">
            <Button type="info" icon="ios-cloud-upload-outline" long>Select file</Button>
          </Upload>
        </Form-item>

        <div class="demo-upload-list" v-for="item in formItem.uploadFiles">
          <Tag closable @on-close="handleClose(item)">{{item.name}}</Tag>
        </div>
        <Form-item label="Description" :label-width="70">
          <Input type="textarea" v-model="formItem.description" :rows="2" placeholder="A brief description about your shape file"></Input>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click.native="upload" :loading="uploading">Upload</Button>
          <Button icon="close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import { vIziToast } from '@/js/notify/v-iziToast'
  import JPanel from '../../widgets/JSPanel'
  import {Vector as VectorSource} from "ol/source";
  import {Vector as VectorLayer} from "ol/layer";
  import {Style, Stroke} from 'ol/style';
  import {all as loadingAll} from 'ol/loadingstrategy'
  import GeoJSON from 'ol/format/GeoJSON';
  import mapLayers from '../../map/js/showLayers.js'

  export default {
    name: 'shape-upload',
    data(){
      return {
        panelOptions: {
          id: 'shape_upload',
          theme: 'primary',//"#0074D9",
          headerTitle: 'shape upload',
          headerControls: {maximize: 'remove'},
          show: 'animated bounceInDown',
          draggable: true,
          contentSize: {
            width: 500,
            height: 300
          },
          onclosed: this.closeThis,
          resizeit:{disable:true}
        },
        formItem:{
          dataName:'',
          uploadFiles:[],
          description:''
        },
        dataList : [],
        uploading: false, // 正在上传

      }
    },
    mounted(){

      // console.log(this.formItem.uploadFiles)
    },
    components: { JPanel },
    methods: {
      handleBeforeUpload(file){
        let index = this.formItem.uploadFiles.findIndex(oFile => oFile.name === file.name)
        if (index > -1){
          this.$Notice.warning({title:file.name + " is already"})
        }else {
          this.formItem.uploadFiles.push(file);
        }
        if (this.formItem.uploadFiles.length === 0){
          this.panelOptions.contentSize.height=220;
        }else if (this.formItem.uploadFiles.length>0 && this.formItem.uploadFiles.length <=3){
          this.panelOptions.contentSize.height=260;
        }else if(this.formItem.uploadFiles.length>3 && this.formItem.uploadFiles.length <= 6){
          this.panelOptions.contentSize.height=300;
        }else if(this.formItem.uploadFiles.length>6){
          this.panelOptions.contentSize.height=340;
        }
        this.$store.dispatch(actionTypes.SHOW_SHAPE_WINDOW, false);
        this.$store.dispatch(actionTypes.SHOW_SHAPE_WINDOW, true);
        return false;
      },
      handleFormatError(file){
        this.$Notice.warning({
          title:'the file format is incorrect',
          desc:'File format of ' + file.name + ' is incorrect, please select shape file'
        });
      },
      handleClose(file){
        let index = this.formItem.uploadFiles.findIndex(oFile => oFile.name === file.name)
        // const fileList = this.$refs.upload.fileList;
        this.formItem.uploadFiles.splice(index, 1);
      },
      closeThis(){
        this.$store.dispatch(actionTypes.SHOW_SHAPE_WINDOW, false);
      },
      upload(){
        this.uploading = true;
        let dataT = new FormData();
        //data = this.formItem;
        dataT.append("dataName", this.formItem.dataName);
        for (let i = 0; i < this.formItem.uploadFiles.length; i++){
          dataT.append("uploadFile", this.formItem.uploadFiles[i]);
        }
        dataT.append("description", this.formItem.description);
        let uploadUrl = "/upload/shape";
        let config = {headers:{'Content-Type':'multipart/form-data'}};
        this.axios({
            url:uploadUrl,
            method:"post",
            data:dataT,
            config:config
          }
        ).then(response=>{
          this.uploading= false;
          if (response.data.msg==="success"){
            this.$Notice.warning({title:"upload success"});
            let relativePath = response.data.data.relativePath;
            let location = [response.data.data.x, response.data.data.y];
            //todo:mapserver url 在这里写死
            let mapUrl = "http://192.168.6.56:8091/cgi-bin/mapserv.exe?map=D:\\soft\\ms4w\\ms4w\\apps\\tutorial\\htdocs\\MapBase\\" +
              relativePath + ".map" + "&SERVICE=WFS&VERSION=1.1.0&REQUEST=getfeature&TYPENAME=" + relativePath + "&OUTPUTFORMAT=geojson";
            let vectorSource = new VectorSource({
              format:new GeoJSON(),
              url:mapUrl,
              strategy: loadingAll
            });
            let vector = new VectorLayer({
              name:relativePath,
              source:vectorSource,
              style: new Style({
                stroke: new Stroke({
                  color: 'blue',
                })
              })
            });
            this.baseMap.addLayer(vector);
            this.geoLocation(this.baseMap, location, 4326);
            this.$store.dispatch('initMap', this.baseMap);
            //todo:上传成功后，自动刷新列表
            this.closeThis();
          }else {
            this.$Notice.warning({title:"upload failure"});
          }
        }).catch(err=>{
          this.$Notice.warning({title:err});
          this.uploading = false;
        })
      },
      async geoLocation(map, layerCenter, epsgCode){
        // let proj4Def = await mapLayers.findProj4Def(epsgCode);
        await mapLayers.layerOrientation(map, layerCenter, epsgCode);
      },
    },
    computed: {
      ...mapState({
        // show: state => state.DataState.showDataSets,
        show: state =>state.WidgetsShowState.showShapeWindow,
        baseMap: state => state.basemap
      })
    }
  }
</script>

<style lang="scss">
  .data-modal {
    padding: 10px;
    text-align: center;
  }

  /*hover 及 focus 时不改变样式*/

  $border: #d7dde4;
  .readonly-input {
    input {
      &:hover {
        border-color: $border;
      }
      &:focus {
        border-color: $border;
        box-shadow: none;
      }
    }
  }
  .demo-upload-list{
    display: inline-block;
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 30px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;

    margin-right: 4px;
  }
</style>
