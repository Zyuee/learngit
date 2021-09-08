<!--
Deprecated
-->
<template>
  <j-panel :options="panelOptions" :show="show" class="data-modal">
    <Form>
      <Form-item label="Data Semantic"  :label-width="100">
          <v-select  taggable transition maxHeight="200px"
           v-model="formItem.dataSemantic"
          :options="dataSemantics"
          ></v-select>
      </Form-item>
      <Form-item label="Data Type"  :label-width="70">
        <Select v-model="formItem.dataType" placeholder="select data type" :disabled="formItem.dataSemantic==='Samples'">
          <Option value="categorical" key="categorical">categorical</Option>
          <Option value="continuous" key="continuous">continuous</Option>
        </Select>
      </Form-item>
      <Form-item label="Data Name" :label-width="80">
        <Row>
          <Col span="7">
            <Input type="text" placeholder="data name" v-model="formItem.dataName"></Input>
          </Col>
          <Col span="8">
          <Upload
            action="//"
            :format="dataFormat"
            :before-upload="handleBeforeUpload"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-error="handleError">
            <Button type="info" icon="ios-cloud-upload-outline" long>Select file</Button>
          </Upload>
          </Col>
          <Col span="6">
          <Input v-if="formItem.uploadFile!==null" v-model="formItem.uploadFile.name" disabled></Input>
          </Col>
        </Row>
      </Form-item>
      <Row style="margin-top: -10px">
        <Col span="12">
        <Form-item label="X Field" :label-width="60">
          <Input type="text" placeholder="x field" v-model="formItem.xField" :disabled="formItem.dataSemantic!=='Samples'"></Input>
        </Form-item>
        </Col>
        <Col span="12">
        <Form-item label="Y Field" :label-width="60">
          <Input type="text" placeholder="x field" v-model="formItem.yField" :disabled="formItem.dataSemantic!=='Samples'"></Input>
        </Form-item>
        </Col>
      </Row>
      <Form-item>
        <Button icon="md-checkmark" type="primary" @click.native="upload" :loading="uploading">Upload</Button>
        <Button icon="close" @click="closeThis">Cancel</Button>
      </Form-item>
    </Form>
  </j-panel>
</template>

<script>
  import JPanel from '@/components/widgets/JSPanel'
  import { vIziToast } from '@/js/notify/v-iziToast'
  import {mapState} from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import vSelect from 'vue-select'
  const rsUploadAction = CTX + '/upload/raster';
  export default {
    name: 'data-upload',
    data() {
      return {
        panelOptions: {
          headerTitle: 'Upload Data',
          paneltype: 'modal',
          theme: "#339999",
          contentSize: {
            width: 460,
            height: 260
          },
          onclosed: this.closeThis,
          headerControls: {maximize: 'remove'}
        },
        formItem:{
          dataSetId:'',
          dataName:'',
          dataSemantic: null,
          dataType:'',
          uploadFile:null,
          xField: '',
          yField: '',
        },

        dataSemantics: [],//数据类型
        semanticOption:[],
        dataTypeList:[{value:'categorical',id:1},{value:'continuous',id:2}],
        loading:false,
        uploading: false, // 正在上传
      }
    },
    components: { JPanel, vSelect},
    methods: {
      closeThis() {
        this.$emit('close');
      },
      handleFormatError( file ) {
        if (this.formItem.dataSemantic=== "Sample Data")
          vIziToast.error("Unacceptable file format! Only CSV  supported.", 10000);
        else
          vIziToast.error("Unacceptable file format! Only GeoTiff  supported.", 10000);
      },
      handleMaxSize( file ) {
        let size =  parseInt(file.size / 1024, 10);
        vIziToast.error('File ' + file.name + ' too large, no more than 200Mb.');
      },
      handleError( error, file, fileList ){
        console.log(error);
        this.uploading = false;
      },
      handleBeforeUpload( file ){
        this.formItem.uploadFile = file;
        //this.uploadFile = file.name;
        return false;// 返回false阻止自动上传实现手动上传 https://github.com/iview/iview/issues/409
      },
      upload() {
        this.uploading = true;
        let dataT = new FormData();
        //data = this.formItem;
        dataT.append("dataSetId", this.dataSetId);
        dataT.append("dataSemantic", this.formItem.dataSemantic);
        dataT.append("dataType", this.formItem.dataType);
        dataT.append("dataName", this.formItem.dataName);
        dataT.append("uploadFile", this.formItem.uploadFile);
        dataT.append("xField", this.formItem.xField);
        dataT.append("yField", this.formItem.yField);
        let uploadUrl = (this.formItem.dataSemantic === "Samples") ? "/upload/samples" : "/upload/raster";
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
            this.$store.dispatch(actionTypes.DATA_SET_LAYER_REFRESH);
            //todo:上传成功后，自动刷新列表
            this.closeThis();
          }else {
            this.$Notice.warning({title:"upload failure"});
          }
        }).catch(err=>{
          this.$Notice.warning({title:err});
          vIziToast.error(err.msg)
          this.uploading = false;
        })
      },
//      listSemantic (query) {
//        if (query !== '') {
//          this.loading = true
//          setTimeout(() => {
//            this.loading = false;
//            const list = this.dataSemantics;
//            this.semanticOption = list.filter(
//              item => item.semanticsName.toLowerCase().indexOf(query.toLowerCase())>-1);
//          }, 200)
//        } else {
//          this.semanticOption = this.dataSemantics;
//        }
//      },
      rasterUpload(uploadT){

      },
    },

    watch:{
      showUpload:function  () {
        this.axios({
          url: '/semantic/listAllEnv',
          method: 'get'
        }).then(response => {
          let semantics = [];
          semantics.push('Samples');
          for(let i = 0; i < response.data.data.length; i++){
            semantics.push(response.data.data[i].semanticsName)
          }
          this.dataSemantics = semantics;
          this.semanticOption = response.data.data;
        }).catch(err => {
          console.log(err)
        })
  }
    },
    computed: {
      ...mapState({
        dataSetId: state => state.DataState.datasetId
      }),
      show() {
        return this.showUpload;
      },
      dataFormat(){
        if (this.formItem.dataSemantic=== -1)
          return ["csv"];
        else
          return ["tif"];
      }
    },
    props: {
      showUpload: {
        type: Boolean,
        required: true,
        default: false
      }
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
</style>
