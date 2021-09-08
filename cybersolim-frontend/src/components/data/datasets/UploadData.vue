<!--
replace DataUpload
author houzhiwei
-->
<template>


  <j-panel :options="panelOptions" :show="show" class="data-modal">
    <div>
      <dataset-create :createShow="creatorShow" @close="closeCreate"></dataset-create>
    </div>
    <Form label-position="left">
      <Row>
        <Col span="12">
          <Form-item class="frameItem" label="Data Type" :label-width="80">
            <RadioGroup v-model="formItem.dataType" @on-change="changeType">
              <Radio label="Raster"></Radio>
              <Radio label="Vector"></Radio>
            </RadioGroup>
          </Form-item>
        </Col>
        <Col span="12">
          <Form-item style="margin-left: 10px" label="Value Type"
                     :label-width="90">
            <Select v-model="formItem.valueType"
                    :disabled="formItem.dataType==='Vector'"
                    placeholder="select value type">
              <Option value="categorical" key="categorical">categorical</Option>
              <Option value="continuous" key="continuous">continuous</Option>
            </Select>
          </Form-item>
        </Col>
      </Row>
<!--         New:  add dataset  -->
      <Row>
        <Col span="18">
          <Form-item required label="DataSet Name" :label-width="120"
                     title="select dataset or create a new one">
            <v-select @change = "dataSetChange($event)"
                      v-model="datasetListName[0]"
                      placeholder="select dataset"
                      :options="datasetListNameOp" label="datasetList"
                      taggable transition maxHeight="200px"></v-select>
<!--            @change = "dataSetChange($event)"-->

          </Form-item>
        </Col>
        <Col span="6">
          <Button icon="ios-add-circle" @click="showCreatePanel">New</Button>
<!--          <Button icon="ios-add-circle" @click="loadDataSets">Load</Button>-->
        </Col>

      </Row>
      <Row>
        <Form-item required label="Data Name" :label-width="120"
                   title="in alphabetic characters, numbers, dashes or underscores">
          <Input v-validate="'required|alpha_dash'"
                 :class="{'input-has-error': errors.has('name') }"
                 v-model.trim="formItem.dataName" name="name"
                 placeholder="name in alphabetic characters, numbers, dashes or underscores"></Input>
        </Form-item>
        <span v-show="errors.has('name')" class="help has-error">{{ errors.first('name')}}</span>
      </Row>
      <Row>
        <Form-item required label="Data Semantic" :label-width="120">
          <v-select taggable transition maxHeight="200px"
                    v-validate="'required'"
                    :class="{'input-has-error': errors.has('semantic') }"
                    v-model.trim="semantic" name="semantic"
                    :options="dataSemantics"
                    placeholder="select or input data semantic"></v-select>
        </Form-item>
        <span v-show="errors.has('semantic')" class="help has-error">{{ errors.first('semantic')}}</span>
      </Row>
      <Form-item>
        <Row>
          <uploader :options="uploadOptions" class="uploader"
                    :auto-start="false" ref="uploader" @complete="complete"
                    @file-error="fileError" @files-added="filesAdded"
                    @files-submitted="filesSubmitted"
                    @file-success="fileSuccess">
            <uploader-unsupport></uploader-unsupport>
            <uploader-btn :attrs="attrs" v-if="uploadViewShow">Select Files</uploader-btn>
            <uploader-list></uploader-list>
          </uploader>
        </Row>
      </Form-item>
      <Form-item>
        <Button icon="md-cloud-upload" :type="btnType" :loading="loading"
                @click.native="upload">{{this.uploadStatus}}
        </Button>
        <Button icon="close" @click="closeThis">Cancel</Button>
      </Form-item>
    </Form>
  </j-panel>
</template>

<script>

  import JPanel from "@/components/widgets/JSPanel";
  import {vIziToast} from "@/js/notify/v-iziToast";
  import {mapState} from "vuex";
  import * as actionTypes from "../../../store/action-types";
  import vSelect from "vue-select";
  import uploader from "vue-simple-uploader";
  import Vue from "vue";
  import UploaderUtils from '../../../js/uploadUtils';
  import DatasetCreate from "./DatasetCreate";

  Vue.use(uploader);

  export default {
    name: "upload-data",
    data() {
      return {
        datasetList: [],
        datasetListName: [],
        selectDatasetTest : [],
        datasetListNameOp : [],

        creatorShow : false,
        panelOptions: {
          headerTitle: "Upload Spatial Data",
          paneltype: "modal",
          theme: "#339999",
          contentSize: {
            width: 530,
            height: 310
          },
          onclosed: this.closeThis,
          resizeit: {handles: "n,s,e", minHeight: 310, minWidth: 530},
          headerControls: {maximize: 'remove'},
          footerToolbar: [
            '<i class="ivu-icon ivu-icon-md-alert"></i><span style="font-size: small">' +
            'Shapefile (shp, shx, dbf, prj, sbn, sbx) will be zipped automatically before upload</span>'
          ]
        },
        // 整个 item
        semantic: null,
        epsgList: [],
        formItem: {
          dataSetId: "",
          dataName: "",
          dataType: "Raster",
          epsg: 0,
          valueType: 'continuous'
        },
        uploadOptions: {
          target: this.uploadTarget,
          headers: {
            Authorization: "Bearer " + this.$auth.token()
          },
          chunkSize: 10 * 1024 * 1024,
          processResponse: this.uploadResp,
          preprocess: this.preProcess,
          query: {dataSetId: this.dataSetId},
          checkChunkUploadedByResponse: (chunk, message) => {
            UploaderUtils.checkChunkUploadedByResponse(chunk, message);
          }
        },
        dataSemantics: [],
        loading: false,
        btnType: "primary",
        uploadStatus: "Upload",
        uploadViewShow: true
      };
    },
    components: {DatasetCreate, JPanel, vSelect},
    methods: {
      closeCreate() {
        this.creatorShow = false;
        this.loadDataSets()
        //增加一个将最新新建的dataset设置为默认值
      },
      showCreatePanel(){
        this.creatorShow = true;//创建项目的jspanel
      },
      // getDataSetId(){
      //   let datasetId = 0;
      //   let dataset = this.datasetListName[0];//名字需要换成select中的名字
      //   for(var i = 0; i< this.datasetList.length; i++){
      //     if(dataset == this.datasetList[i].datasetName){
      //       datasetId = this.datasetList[i].datasetId;
      //     }
      //   }
      //   return datasetId;
      // },
      dataSetChange(event){
        // this.selectDatasetTest = event.target.value
        // console.log(this.datasetListNameOp)

      },
      loadDataSets(){
        this.axios({
          url:'/dataSet/listUserDataSets',
          method:'GET',
        }).then(response=>{
          this.datasetListName.length = 0;//将原始的dataset名称清空
          this.datasetListNameOp.length = 0;//将原始的dataset名称清空
          this.datasetList = response.data.data

          for (var i = 0; i < response.data.data.length; i++) {
            this.datasetListName.push(
              response.data.data[i].datasetName,
            );
            this.datasetListNameOp.push(
              response.data.data[i].datasetName,
            );
          }
        })

        this.axios({
          url:'/dataSet/listSubscribedFiles',
          method:'GET',
        }).then(response=>{
          this.subscribedFiles = response.data.data;
          for(let item of this.subscribedFiles){
            item["fromType"] = item.groupId===0?"user" : "group";
            item["fromName"] = item.groupId===0?item.userName:item.groupName;
          }
        })
      },
      closeThis() {
        this.uploadStatus = "Upload";
        this.loading = false;
        this.$emit("close");
        // 不加这个的话，会报错 Validating a non-existent field: "#7". Use "attach()" first.
        this.$validator.pause();
        this.$nextTick(() => {
          this.$validator.errors.clear();
          this.$validator.fields.items.forEach(field => field.reset());
          this.$validator.fields.items.forEach(field => this.errors.remove(field));
          this.$validator.resume()
        });
      },
      changeType(value) {
        this.dataSemantics = []; // 需要先清空
        if (value === "Vector") {
          this.$http.get("/semantic/vectors").then(resp => {
            resp.data.forEach(item => {
              this.dataSemantics.push({
                label: item.semantic,
                value: item.id
              });
              this.uploadViewShow = false;
              this.$nextTick(() => {
                this.uploadViewShow = true;
              });
            });
          });
        } else {
          this.$http.get("/semantic/listAllEnv?topLayerPath=null").then(resp => {
            resp.data.data.forEach(item => {
              this.dataSemantics.push({
                label: item.semanticsName,
                value: item.semanticsId
              });
              this.uploadViewShow = false;
              this.$nextTick(() => {
                this.uploadViewShow = true;
              });
            });
          }).catch(err => {
            console.error(err);
          });
        }
      },
      upload() {
        let uploader = this.$refs.uploader.uploader;
        console.log(uploader);
        let fileList = uploader.fileList;
        if (fileList.length === 0) {
          vIziToast.warning("No files selected.");
          return;
        } else {
          fileList.forEach((item) => {
            console.log(item.getExtension());
          });
        }
        this.$validator.validateAll().then(r => {
          if (r) {
            switch (this.uploadStatus) {
              case "Upload":
                uploader.resume();
                this.loading = true;
                this.uploadStatus = " ";
                break;
              case "Pause":
                uploader.pause();
                this.loading = false;
                this.uploadStatus = "Resume";
                break;
              case "Resume":
                uploader.resume();
                this.loading = true;
                this.uploadStatus = "Pause";
                break;
              case "Success":
                vIziToast.info("File already uploaded");
                break;
            }
          } else {
            uploader.pause();
            this.uploadStatus = "Resume";
            this.loading = false;
          }
        }).catch(err => {
          console.log(err);
        });
      },
      filesSubmitted(files, fileList, event) {
        let uploader = this.$refs.uploader.uploader;
        fileList.forEach((item) => {
          let shpFormats = ["shp", "shx", "dbf", "prj", "qpj", "sbn", "sbx"];
          if (shpFormats.indexOf(item.getExtension()) !== -1) {
            uploader.removeFile(item);
          }
        });
        fileList.forEach((item) => {
          console.log(item.getExtension());
        });
      },
      filesAdded(files, fileList, event) {
        this.uploadStatus = "Upload";
        this.loading = false;
        this.btnType = "primary";
        let uploader = this.$refs.uploader.uploader;
        let obj = UploaderUtils.checkFormat(this.formItem.dataType);
        let format = obj.format;
        let msg = obj.msg;
        let valid = false;
        this.formItem.dataName = UploaderUtils.getBaseName(fileList[0]);
        fileList.forEach((item, index) => {
          if (item.size > 1024 * 1024 * 1024) {
            vIziToast.error("File " + item.name + " is larger than 1Gb, it will be ignored");
            uploader.removeFile(item);
          }
          if (format.indexOf(item.getExtension()) === -1) {
            vIziToast.warning("Format of " + item.name + " is not supported, " + msg);
            uploader.removeFile(item);
          } else {
            valid = true;
          }
          //zipped file
          if (item.getExtension() === 'zip') {
            //TODO UploaderUtils.checkZippedFiles(item, this.formItem.dataType)
          }
        });
        if (valid && this.formItem.dataType === "Vector") {
          let msg = UploaderUtils.checkShapefile(fileList);
          if (msg[0] > 0) {
            vIziToast.error(msg, 8000);
            fileList.ignored = true;
            return;
          }
          UploaderUtils.zipShapefile(uploader);
        }
        uploader.fileList.forEach((item) => {
          console.log(item.getExtension());
        });
      },
      // 处理上传响应
      uploadResp(resp, cb) {
        //resp为字符串
        cb(null, resp); // 必须调用以通知上传组件显示error
        try {
          let respObj = eval("(" + resp + ")");
          if (respObj.status >= 400) {
            vIziToast.error(respObj.errors[0]);
          }
        } catch (err) {
          console.error(err);
        }
      },
      preProcess(chunk) {
        UploaderUtils.preProcess(chunk, this.uploadOptions.chunkSize)
      },
      uploadTarget(file, chunk, isTest) {
        if (this.formItem.dataType === "Raster") {
          return CTX + "upload/chunk/raster";
        } else if (this.formItem.dataType === "Vector") {
          return CTX + "upload/chunk/vector";
        }
      },
      complete() {
        this.$emit('refresh');
        let _this = this;
        setTimeout(() => {
          _this.closeThis();
        }, 5000);
      },
      //一个文件上传成功
      fileSuccess(rootFile, file, message, chunk) {
        this.uploadStatus = "Success";
        this.loading = false;
        this.btnType = "success";
        let query = {
          // dataSetId: this.dataSetId,
          dataSetId: this.getDataSetId,
          dataSemantic: this.semantic.label,
          dataSemanticId: this.semantic.value,
          dataType: this.formItem.dataType,
          valueType: this.formItem.valueType,
          dataName: this.formItem.dataName,
          fileName: file.name,
          identifier: file.uniqueIdentifier,
          totalSize: file.size
        };
        console.log(query);
        this.$http.post("/upload/chunk/merge", query).then(resp => {
          console.log(resp);
          this.$store.dispatch(actionTypes.DATA_SET_LAYER_REFRESH);
          vIziToast.success("File uploaded");
        }).catch(err => {
          console.error(err);
        });
      },
      fileError(rootFile, file, message, chunk) {
        console.log("fileError");
      }
    },
    mounted() {

      this.$nextTick(() => {
        window.uploader = this.$refs.uploader;

      });
    },
    watch: {
      showUpload: function () {
        this.loadDataSets();
        this.dataName = '';
        this.semantic = null;
        this.changeType(this.formItem.dataType);
      }
    },
    computed: {
      // ...mapState({
      //   dataSetId: state => state.DataState.datasetId
      // }),
      getDataSetId(){
        let datasetId = 0;
        let dataset = this.datasetListName[0];//名字需要换成select中的名字
        console.log(dataset);
        for(var i = 0; i< this.datasetList.length; i++){
          if(dataset == this.datasetList[i].datasetName){
            datasetId = this.datasetList[i].datasetId;
          }
        }

        return datasetId;
      },
      // ...mapState({
      //   dataSetId(state){
      //     let datasetId = 0;
      //     let dataset = this.datasetListName[0];//名字需要换成select中的名字
      //     console.log(dataset);
      //     for(var i = 0; i< this.datasetList.length; i++){
      //       if(dataset == this.datasetList[i].datasetName){
      //         datasetId = this.datasetList[i].datasetId;
      //       }
      //     }
      //     state.DataState.datasetId = datasetId;
      //     return state.DataState.datasetId;
      //   }
      //
      // }),


      show() {
        return this.showUpload;
      },
      attrs() {
        if (this.formItem.dataType === "Raster") {
          return {
            accept: "image/tiff,image/geotiff,image/x-zipped-geotiff,image/x-zipped-tiff"
          };
        } else {
          return {
            accept: "application/shp,application/x-zipped-shp,application/zip"
          };
        }
      }
    },
    props: {
      showUpload: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  };
</script>

<!--覆盖引入的file.vue的样式不能加scoped-->
<style lang="scss">
  .uploader-file[status="waiting"] .uploader-file-pause,
  .uploader-file[status="uploading"] .uploader-file-pause {
    display: none;
  }

  .uploader-file {
    border-bottom: 0.1px solid lightgrey !important;

    &[status="paused"] .uploader-file-resume {
      display: none !important;
    }

    &[status="success"] .uploader-file-remove {
      display: block;
    }
  }
</style>

<style lang="scss" scoped>
  @import "../../../assets/scss/validate.scss";
  @import "../../../assets/scss/uploader.scss";

  .data-modal {
    padding: 10px;
    text-align: center;
  }

  .input-has-error {
    border: 0.5px solid red;
  }

  /deep/ .frameItem .ivu-form-item-content {
    border: solid 0.5px #88888830;
    border-radius: 5px;
    /*padding-left: 10px;*/
  }
</style>
