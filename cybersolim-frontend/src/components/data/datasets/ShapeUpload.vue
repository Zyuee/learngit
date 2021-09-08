<!--
author houzhiwei
replace ShapeLoad.vue
-->
<template>
  <div>
    <j-panel :options="panelOptions" :show="show" class="data-modal">
      <Form>
        <Form-item>
          <Row>
            <uploader :options="uploadOptions" class="uploader" :auto-start="false" ref="uploader"
                      @file-success="fileSuccess" @file-added="fileAdded">
              <uploader-unsupport></uploader-unsupport>
              <uploader-btn :attrs="{accept: 'application/shp,application/x-zipped-shp,application/zip'}">
                select zipped shapefiles
              </uploader-btn>
              <uploader-list></uploader-list>
            </uploader>
          </Row>
        </Form-item>
        <Row>
          <Col span="10">
            <Form-item label="name" :label-width="90" label-position="left">
              <Input v-model="name" name="name" v-validate="{regex: /^[-_A-z0-9 \u4e00-\u9fa5]{2,15}$/}"
                     placeholder="name of the data"></Input>
            </Form-item>
            <span v-show="errors.has('name')" class="help has-error">{{ errors.first('name')}}</span>
          </Col>
          <Col span="14">
            <Form-item required label="Semantic" :label-width="90" label-position="left">
              <v-select taggable transition maxHeight="200px" v-validate="'required'"
                        :class="{'input-has-error': errors.has('semantic') }"
                        v-model="semantic" name="semantic"
                        :options="dataSemantics" placeholder="data semantic"></v-select>
            </Form-item>
            <span v-show="errors.has('semantic')" class="help has-error">{{ errors.first('semantic')}}</span>
          </Col>
        </Row>
        <Form-item label="Description" :label-width="90" label-position="left">
          <Input type="textarea" v-model="description" :rows="1"
                 placeholder="A brief description about your shape file"></Input>
        </Form-item>
        <Form-item>
          <Button icon="md-cloud-upload" type="primary" @click.native="upload" :loading="uploading">Upload</Button>
          <Button icon="close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import * as actionTypes from "../../../store/action-types";
  import {vIziToast} from "@/js/notify/v-iziToast";
  import JPanel from "../../widgets/JSPanel";
  import {Vector as VectorSource} from "ol/source";
  import {Vector as VectorLayer} from "ol/layer";
  import {Style, Stroke} from 'ol/style';
  import {all as loadingAll} from 'ol/loadingstrategy'
  import GeoJSON from 'ol/format/GeoJSON';
  import mapLayers from "../../map/js/showLayers.js";
  import uploader from "vue-simple-uploader";
  import vSelect from "vue-select";
  import Vue from "vue";
  import UploaderUtils from '../../../js/uploadUtils'

  Vue.use(uploader);

  export default {
    name: "shape-upload",
    data() {
      return {
        panelOptions: {
          id: "shape_upload",
          headerTitle: "upload zipped shapefile",
          paneltype: 'modal',
          headerControls: {maximize: "remove"},
          draggable: true,
          contentSize: {
            width: 550,
            height: 300
          },
          onclosed: this.closeThis,
          resizeit: {handles: "n,s", minHeight: 290},
          footerToolbar: [
            '<i class="ivu-icon ivu-icon-md-alert"></i><span style="font-size: small">' +
            'Shapefiles must include shp, shx, and dbf files, and should be zipped. </span>'
          ]
        },
        uploadOptions: {
          target() {
            return CTX + "upload/chunk/vector";
          },
          preprocess: this.preProcess,
          headers: {
            Authorization: "Bearer " + this.$auth.token()
          },
          chunkSize: 10 * 1024 * 1024 // 只有超过 10 M 才进行分块
        },
        dataSemantics: [],
        description: "",
        semantic: null,
        name: '',
        uploading: false // 正在上传
      };
    },
    mounted() {
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader;
        this.$http.get("/semantic/vectors").then(resp => {
          if (resp.data) {
            resp.data.forEach(item => {
              this.dataSemantics.push({
                label: item.semantic,
                value: item.id
              });
            });
          } else {
            console.error("server error, no vector data semantics");
          }
        });
      });
    },
    components: {JPanel, vSelect},
    methods: {
      closeThis() {
        this.$store.dispatch(actionTypes.SHOW_SHAPE_WINDOW, false);
      },
      preProcess(chunk) {
        UploaderUtils.preProcess(chunk, this.uploadOptions.chunkSize);
      },
      fileAdded(file) {
        this.name = file.name.replace("." + file.getExtension(), "");
        let format = ["shp", "shx", "dbf", "prj", "sbn", "sbx", "zip"];
        if (file.size > 100 * 1024 * 1024) {
          vIziToast.warning("File " + file.name + " is too larger to upload");
          file.ignored = true;
        }
        if (format.indexOf(file.getExtension()) === -1) {
          vIziToast.warning(
            "Format of " + file.name + " is not support, please select shapefile"
          );
          file.ignored = true;
        }
      },
      fileSuccess(rootFile, file, message, chunk) {
        let query = {
          description: this.description,
          dataType: "Vector",
          identifier: file.uniqueIdentifier,
          totalSize: file.size,
          dataName: this.name.replace(" ", "_") + "." + file.getExtension(),
          dataSemanticId: this.semantic.value,
          dataSemantic: this.semantic.label
        };
        this.uploading = false;
        this.$http.post("/upload/chunk/merge", query).then(resp => {
          //console.log(resp);
          let layers = resp.data;
          vIziToast.success("File uploaded!");
          layers.forEach((item, i) => {
            let relativePath = item.relativePath;
            //let location = [item.x, item.y];
            let mapUrl = item.url; //WFS url
            let vectorSource = new VectorSource({
              format: new GeoJSON(),
              url: mapUrl,
              strategy: loadingAll
            });
            let vector = new VectorLayer({
              name: relativePath,
              source: vectorSource,
              style: new Style({
                stroke: new Stroke({
                  color: "blue"
                })
              })
            });
            this.baseMap.addLayer(vector);
          });
          this.geoLocation(this.baseMap, location, 4326);
          this.$store.dispatch("initMap", this.baseMap);
        }).catch(err => {
          console.error(err);
          vIziToast.error(err.msg + " Please re-project the data to a valid projection first!", 10000);
        });

      },
      upload() {
        let uploader = this.$refs.uploader.uploader;
        let fileList = uploader.fileList;
        if (fileList.length === 0) {
          vIziToast.warning("Please select files first");
          return;
        } else {
          let msg = UploaderUtils.checkShapefile(fileList);
          if (msg.length > 0) {
            vIziToast.error("Shapefile MUST contain files with extension " + msg, 8000);
            return;
          }
        }
        this.$validator.validateAll().then(r => {
          if (r) {
            uploader = UploaderUtils.zipShapefile(uploader);
            this.uploading = true;
            uploader.resume();
          }
        });
      },
      async geoLocation(map, layerCenter, epsgCode) {
        // let proj4Def = await mapLayers.findProj4Def(epsgCode);
        await mapLayers.layerOrientation(map, layerCenter, epsgCode);
      }
    },
    computed: {
      ...mapState({
        // show: state => state.DataState.showDataSets,
        show: state => state.WidgetsShowState.showShapeWindow,
        baseMap: state => state.basemap
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/validate.scss";
  @import "../../../assets/scss/uploader.scss";

  .ivu-alert-with-desc {
    padding: 8px;
  }

  .data-modal {
    padding: 10px;
    text-align: center;
  }

</style>
