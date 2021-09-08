<!--
modified from UploadData.vue
TODO 改成适用于不同模型的通用上传组件
author houzhiwei
-->
<template>
  <j-panel :options="panelOptions" :show="show" class="data-modal">
    <Alert show-icon closable> 1. Select data semantic; 2. Choose the file; 3.
      Click upload button
    </Alert>
    <Form label-position="left">
      <Row>
        <Form-item class="frameItem" label="Data Type" :label-width="80">
          <RadioGroup v-model="inputDataType" @on-change="changeType">
            <Radio label="Spatial data"></Radio>
            <Radio label="Lookups"></Radio>
            <Radio label="Climate data"></Radio>
            <!--    观测数据一般用于验证，不是必须的        -->
            <Radio label="Observed data"></Radio>
          </RadioGroup>
        </Form-item>
      </Row>
      <Row>
        <Form-item required label="Data Semantic" :label-width="120">
          <Select taggable maxHeight="200px"
                  v-validate="'required'"
                  @on-select="selectItem"
                  :class="{'input-has-error': errors.has('dataItem') }"
                  v-model.trim="selectedInput" name="dataItem"
                  placeholder="select an input data item to upload">
            <Option v-for="item in availableInputs" :value="item.value"
                    :key="item.value" :title="item.title?item.title:''">
              {{ item.label }}
            </Option>
          </Select>
        </Form-item>
        <span v-show="errors.has('spatial-input')" class="help has-error">{{ errors.first('spatial-input')}}</span>
      </Row>
      <Row>
        <Form-item label="File Name" :label-width="120"
                   title="in alphabetic characters, numbers, dashes or underscores">
          <Input readonly v-model.trim="formItem.dataName" name="name"
                 placeholder="name of the file"></Input>
        </Form-item>
      </Row>
      <Form-item>
        <Row>
          <uploader :options="uploadOptions" class="uploader"
                    :auto-start="false" ref="uploader" @complete="complete"
                    @file-error="fileError" @files-added="filesAdded"
                    @files-submitted="filesSubmitted"
                    @file-success="fileSuccess">
            <uploader-unsupport></uploader-unsupport>
            <uploader-btn :attrs="attrs">select files</uploader-btn>
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
  import * as actionTypes from "../../store/action-types";
  import vSelect from "vue-select";
  import uploader from "vue-simple-uploader";
  import Vue from "vue";
  import UploaderUtils from '../../js/uploadUtils'

  Vue.use(uploader);

  export default {
    name: "upload-seims-data",
    data() {
      return {
        panelOptions: {
          headerTitle: "Upload Seims Data",
          paneltype: "modal",
          theme: "#339999",
          contentSize: {
            width: 540,
            height: 310
          },
          onclosed: this.closeThis,
          resizeit: {handles: "n,s,e", minHeight: 310, minWidth: 530},
          headerControls: {maximize: 'remove'},
          footerToolbar: [
            '<i class="ivu-icon ivu-icon-md-alert"></i><span style="font-size: small; color: gray">' +
            'Shapefiles must include shp, shx, and dbf files, and should be zipped</span>'
          ]
        },
        projList: [],
        inputDataType: 'Spatial data',
        selectedInput: '',
        availableInputs: [],
        semantic: '',
        formItem: {
          dataName: "",
          dataType: "",
          epsg: 0
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
        loading: false,
        btnType: "primary",
        uploadStatus: "Upload"
      };
    },
    components: {JPanel, vSelect},
    methods: {
      selectItem(item) {
        this.formItem.dataType = item.dataType;
        this.semantic = item.value;
      },
      changeType(value) {
        this.fetchInputs(value);
      },
      closeThis() {
        this.uploadStatus = "Upload";
        this.loading = false;
        this.$emit("close");
      },
      upload() {
        let uploader = this.$refs.uploader.uploader;
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
                this.uploadStatus = "Pause";
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
        // 如果用户上传的是shapefile的文件，需要避免压缩为zip后重复上传
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
        UploaderUtils.uploadResp(resp, cb);
      },
      preProcess(chunk) {
        UploaderUtils.preProcess(chunk, this.uploadOptions.chunkSize)
      },
      uploadTarget(file, chunk, isTest) {
        if (this.formItem.dataType.toLowerCase() === "raster") {
          return CTX + "upload/chunk/raster";
        } else if (this.formItem.dataType.toLowerCase() === "vector") {
          return CTX + "upload/chunk/vector";
        } else if (this.formItem.dataType.toLowerCase() === "csv") {
          return CTX + "upload/chunk/csv";
        }
      },
      //所有文件上传成功
      complete() {
        this.$emit('refresh');
        /*let _this = this;
        setTimeout(() => {
          _this.closeThis();
        }, 5000);*/
      },
      //一个文件上传成功
      fileSuccess(rootFile, file, message, chunk) {
        this.uploadStatus = "Success";
        this.loading = false;
        this.btnType = "success";
        let query = {
          dataSetId: this.dataSetId,
          dataSemantic: this.semantic,
          // dataSemanticId: this.semantic.value,
          dataType: this.formItem.dataType,
          // valueType: this.formItem.valueType,
          dataName: this.formItem.dataName,
          fileName: file.name,
          identifier: file.uniqueIdentifier,
          totalSize: file.size
        };
        this.$http.post("/upload/chunk/merge", query).then(resp => {
          this.$store.dispatch(actionTypes.DATA_SET_LAYER_REFRESH);
          //TODO 更新SEIMS数据文件目录
          vIziToast.success("File uploaded");
        }).catch(err => {
          console.error(err);
        });
      },
      fileError(rootFile, file, message, chunk) {
        console.log(message);
      },
      fetchInputs(value) {
        if (!value) {
          value = this.inputDataType;
        }
        // this.availableInputs = [];
        if (value === 'Observed data') {
          this.$http.get("/seims/init/observed").then(resp => {
            this.availableInputs = resp.data;
          });
        } else {
          this.$http.get("/seims/init/inputs", {
            params: {inputDataType: value}
          }).then(resp => {
            this.availableInputs = resp.data;
          });
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader;
      });
    },
    watch: {
      showUpload: function () {
        /*this.dataName = '';
        this.semantic = null;
        this.changeItem(this.formItem.dataType);*/
        this.fetchInputs();
      }
    },
    computed: {
      show() {
        return this.showUpload;
      },
      attrs() {
        if (this.formItem.dataType) {
          if (this.formItem.dataType.toLowerCase() === "raster") {
            return {
              accept: "image/tiff,image/geotiff,application/geotiff,image/x-zipped-geotiff,image/x-zipped-tiff"
            };
          } else if (this.formItem.dataType.toLowerCase() === "vector") {
            return {
              accept: "application/shp,application/x-zipped-shp,application/zip"
            };
          } else if (this.formItem.dataType.toLowerCase() === "csv" ||
            this.formItem.dataType.toLowerCase() === "soilsample") {
            return {
              accept: "text/csv"
            };
          }
        }
      }
    },
    props: {
      showUpload: {
        type: Boolean,
        required: true,
        default: false
      },
      dataSetId: {
        type: Number,
        required: true,
        default: -1
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
  @import "../../assets/scss/validate.scss";
  @import "../../assets/scss/uploader.scss";

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
