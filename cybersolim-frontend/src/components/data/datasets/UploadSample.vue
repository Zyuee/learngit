<template>
  <j-panel :options="panelOptions" :show="show" class="data-modal">
    <Alert show-icon closable>Upload tabular data such as samples, observations,
      and lookups.
      <br>Sample files must contain at least three columns named 'ID', 'X', and 'Y' (case sensitive).
    </Alert>
    <Form label-position="left">
      <Row>
        <Form-item required label="Data Semantic" :label-width="150">
          <v-select taggable transition maxHeight="200px"
                    v-validate="'required'"
                    :class="{'input-has-error': errors.has('semantic') }"
                    v-model.trim="semantic" name="semantic"
                    :options="dataSemantics"
                    placeholder="select or input data semantic"></v-select>
        </Form-item>
        <span v-show="errors.has('semantic')" class="help has-error">{{ errors.first('semantic')}}</span>
      </Row>
      <Row>
        <Form-item required label="Data Name" :label-width="150"
                   title="in alphabetic characters, numbers, dashes or underscores">
          <Input v-validate="'required|alpha_dash'"
                 :class="{'input-has-error': errors.has('name') }"
                 v-model.trim="formItem.dataName" name="name"
                 placeholder="data name in alphabetic characters, numbers, dashes or underscores"></Input>
        </Form-item>
        <span v-show="errors.has('name')" class="help has-error">{{ errors.first('name')}}</span>
      </Row>
      <!--这个应该是根据语义内容来确定是否显示/必须-->
      <Row>
        <Form-item required label="Coordinate System" :label-width="150">
          <Select v-model="formItem.epsg"
                  clearable
                  filterable
                  v-validate="'required'"
                  name="crs"
                  :class="{'input-has-error': errors.has('crs') }"
                  remote
                  :remote-method="fetchProjection"
                  :loading="loading"
                  placeholder="Input coordinate reference system name or EPSG code to search">
            <Option v-for="item in projList" :value="item.srid"
                    :key="item.srid" :title="item.srName">
              {{ item.srName +' (EPSG:' + item.srid + ')' }}
            </Option>
          </Select>
        </Form-item>
        <span v-show="errors.has('crs')" style="z-index: 100; position: inherit" class="help has-error">{{ errors.first('crs')}}</span>
      </Row>
<!--      <Row style="margin-top: -10px">-->
<!--        <Col span="12">-->
<!--          <Form-item label="X Field" style="margin-left: 10px; text-align: center !important"-->
<!--                     :label-width="90">-->
<!--            <Input type="text" placeholder="x field name"-->
<!--                   v-model="formItem.xField"></Input>-->
<!--          </Form-item>-->
<!--        </Col>-->
<!--        <Col span="12">-->
<!--          <Form-item style="margin-left: 10px; text-align: center !important"-->
<!--                     label="Y Field"-->
<!--                     :label-width="90">-->
<!--            <Input type="text" placeholder="y field name"-->
<!--                   v-model="formItem.yField"></Input>-->
<!--          </Form-item>-->
<!--        </Col>-->
<!--      </Row>-->
      <Row>
        <Form-item>
          <uploader :options="uploadOptions" class="uploader"
                    :auto-start="false" ref="uploader" @complete="complete"
                    @file-error="fileError" @files-added="filesAdded"
                    @file-success="fileSuccess">
            <uploader-unsupport></uploader-unsupport>
            <uploader-btn :attrs="attrs">Select Files</uploader-btn>
            <uploader-list></uploader-list>
          </uploader>
        </Form-item>
      </Row>
      <Form-item>
        <Button icon="md-checkmark" :type="btnType" :loading="loading"
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
  import FileMd5 from "@/js/fileMD5.js";
  import UploaderUtils from '../../../js/uploadUtils'

  import Vue from "vue";

  Vue.use(uploader);

  export default {
    name: "upload-sample",
    data() {
      return {
        panelOptions: {
          headerTitle: "Upload Tabular Data",
          paneltype: "modal",
          theme: "#339999",
          contentSize: {
            width: 720,
            height: 420
          },
          onclosed: this.closeThis,
          resizeit: {
            handles: "s,e",
            minHeight: 330,
            maxHeight: 500,
            minWidth: 520,
            maxWidth: 1000
          },
          headerControls: {maximize: 'remove'}
        },
        // 整个 item
        semantic: null,
        projList: [],
        formItem: {
          dataSetId: "",
          dataName: "",
          dataType: "Sample",
          file: null,
          xField: "X",
          yField: "Y",
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
        dataSemantics: [],
        loading: false,
        btnType: "primary",
        uploadStatus: "Upload"
      };
    },
    components: {JPanel, vSelect},
    methods: {
      closeThis() {
        this.uploadStatus = "Upload";
        this.loading = false;
        this.$emit("close");
      },
      fetchProjection(query) {
        this.loading = true;
        this.$http.get("/semantic/proj", {params: {sr: query}}).then(resp => {
          // console.log(resp.data);
          this.projList = resp.data;
          this.loading = false;
        }).catch(err => {
          console.error(err);
        });
      },
      upload() {
        let uploader = this.$refs.uploader.uploader;
        if (uploader.fileList.length === 0) {
          vIziToast.warning("No files selected.");
          return;
        }
        let obj = UploaderUtils.checkFormat("csv");
        let format = obj.format;
        let msg = obj.msg;
        let valid = false;
        uploader.fileList.forEach((item, index) => {
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
        });
        this.$validator.validateAll().then(r => {
          if (r && valid) {
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
            return;
          }
        }).catch(err => {
          console.log(err);
        });
      },
      filesAdded(files, fileList, event) {
        this.uploadStatus = "Upload";
        this.loading = false;
        this.btnType = "primary";
        let format = ["csv"];
        let msg = "please select comma-separated-values(CSV) file";
        this.formItem.dataName = UploaderUtils.getBaseName(fileList[0]);
        fileList.forEach((item, index) => {
          if (format.indexOf(item.getExtension()) === -1) {
            vIziToast.warning("Format of " + item.name + " is not supported, " + msg);
            item.ignored = true;
          }
          if (item.size > 1024 * 1024 * 1024 * 1) {
            vIziToast.error(
              "File " + item.name + " is larger than 1Gb, it will be ignored"
            );
            item.ignored = true;
          }
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
        UploaderUtils.preProcess(chunk, this.uploadOptions.chunkSize);
      },
      uploadTarget(file, chunk, isTest) {
        return CTX + "upload/chunk/samples";
      },
      complete() {
        this.$emit('refresh');
      },
      //一个文件上传成功
      fileSuccess(rootFile, file, message, chunk) {
        this.uploadStatus = "Success";
        this.loading = false;
        this.btnType = "success";
        let query = {
          dataSetId: this.dataSetId,
          dataSemantic: this.semantic.label,
          dataSemanticId: this.semantic.value,
          dataType: this.formItem.dataType,
          // variableType: this.formItem.variableType,
          fileName: file.name,
          dataName: this.formItem.dataName,
          identifier: file.uniqueIdentifier,
          totalSize: file.size,
          epsg: this.formItem.epsg,
          xField: this.formItem.xField,
          yField: this.formItem.yField
        };
        this.$http.post("/upload/chunk/merge", query).then(resp => {
          this.$store.dispatch(actionTypes.DATA_SET_LAYER_REFRESH);
        }).catch(err => {
          console.error(err);
        });
        vIziToast.success("File uploaded");
      },
      fileError(rootFile, file, message, chunk) {
        console.error("fileError: " + message);
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader;
      });
    },
    watch: {
      showUpload: function () {
        this.dataSemantics = []; // 需要先清空
        this.$http.get("/semantic/samples").then(resp => {
          resp.data.forEach(item => {
            this.dataSemantics.push({
              label: item.sampleSemanticName,
              value: item.sampleSemanticId
            });
          });
        }).catch(err => {
          console.error(err);
        });
        /* this.$http.get("/semantic/epsgList").then(resp => {
           console.log(resp.data);
           this.epsgList = resp.data;
         }).catch(err => {
           console.error(err);
         });*/
      }
    },
    computed: {
      ...mapState({
        dataSetId: state => state.DataState.datasetId
      }),
      show() {
        return this.showUpload;
      },
      attrs() {
        return {
          accept:
            "text/comma-separated-values,text/csv,application/csv,text/x-csv"
        };
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
    padding-left: 10px;
  }
</style>
