<!--
@author houzhiwei
-->
<template>
  <j-panel :options="panelOptions" :show="show">
    <Row>
      <Form :model="model" label-position="right" :label-width="88" style="margin: 10px">
        <Row>
          <Col span="11">
            <Form-item label="Name">
              <Input readonly v-model="model.modelName" class="readonly-input"></Input>
            </Form-item>
          </Col>
          <Col span="13">
            <Form-item label="Date">
              <Input readonly v-model="model.generatedTime" class="readonly-input"></Input>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <Form-item label="Purpose">
              <Input readonly v-model="model.purpose" class="readonly-input"></Input>
            </Form-item>
          </Col>
         <!-- <Col span="13">
            <Form-item label="TimeSeriesInputs">
              <Input readonly v-model="model.timeSeriesInputs" class="readonly-input"></Input>
            </Form-item>
          </Col>--><Col span="13"><div style="text-align: center">
          <Button type="primary" title="download model configuration file"
                 id="generateBtn" @click="download" :loading="isLoading">Download</Button></div>
          </Col>
        </Row>
       <!-- <Row style="text-align: center">
          <Button type="primary" title="download model configuration file"
                  size="small" id="generateBtn" @click="download" :loading="isLoading">Download</Button>
        </Row>-->
      </Form>
    </Row>
    <Row>
      <div class="data-detail-table">
        <Table size="small" border :data="tblData" :columns="cols" height="200">
        </Table>
        <!--<div class="table-page">-->
        <!--<div style="float: right;">-->
        <!--<Page :total="rows" :current="currentPage" @on-change="changePage"></Page>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </Row>
  </j-panel>
</template>

<script>
  import {mapState} from 'vuex'
  import JPanel from '@/components/widgets/JSPanel'
  import {vIziToast} from "../../js/notify/v-iziToast";
  // import expandRow from "../seims/datasets/table-expand";

  export default {
    name: 'model-structure-detail',
    data() {
      return {
        panelOptions: {
          headerTitle: 'Seims Model Structure',
          contentSize: {
            width: 550,
            height: 380
          },
          onclosed: this.closeThis,
        },
        model: {
          modelName: '',
          generatedTime: '',
          purpose: '',
          timeSeriesInputs: ''
        },
        isLoading: false,
        tblData: [],
        cols: [
          {
            title: 'Process',
            key: 'process',
            width: 180
          }, {
            title: 'Method',
            key: 'algorithm',
            width: 280
          }, {
            title: 'Module',
            width: 150,
            key: 'componentId'
          }],
        rows: 0, // 总数据量
        currentPage: 1, //当前页数
      }
    },
    components: {JPanel},
    methods: {
      loadData() {
        if (typeof this.modelId != 'number') {
          vIziToast.error("Invalid model id");
          this.closeThis();
          return;
        }
        this.$http.get('/seims/model?id=' + this.modelId).then((json) => {
          this.model.modelName = json.data.model.modelName;
          this.model.generatedTime = new Date(json.data.model.generatedTime).toLocaleDateString();
          this.tblData = json.data.details.modelStructures;
          // console.log(this.tblData);
          this.model.purpose = json.data.details.purpose;
          this.model.timeSeriesInputs = json.data.details.timeSeriesInputs.join(", ");
        }).catch((err) => {
          console.error(err);
          vIziToast.error(err.response, 6000);
        });
      },
      closeThis() {
        this.$emit('close');
      },
      download() {
        this.$http({
          method: 'post',
          url: '/seims/download/config',
          data: [this.modelId],
          responseType: 'blob'
        }).then((resp) => {
          // console.log(resp);
          //多个id的话，应该用 application/zip
          let data = new Blob([resp.data], {type: "text/plain"});
          let link = document.createElement('a');
          //default name
          let fileName = resp.headers['filename']; //下载后文件名,需要后台暴露该文件头到 response
          if ('download' in link) { // 非IE下载
            link.download = fileName; //下载后文件名
            link.style.display = 'none';
            link.href = window.URL.createObjectURL(data); //创建下载的链接
            document.body.appendChild(link);
            link.click(); //点击下载
            window.URL.revokeObjectURL(link.href); // 释放URL 对象
            document.body.removeChild(link); //下载完成移除元素
          } else { // IE10+下载
            navigator.msSaveBlob(data, fileName);
          }
        }).catch(err => {
          vIziToast.error(err);
        });
      }
    },
    computed: {
      show() {
        if (this.detailShow) {
          this.loadData();
        }
        return this.detailShow;
      },
      ...mapState({
        // show: state => state.SeimsState.showSeimsModel
      })
    },
    props: {
      detailShow: {
        type: Boolean,
        required: true,
        default: false
      },
      modelId: {
        type: Number,
        require: true,
        default: -1
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/data-detail";
</style>
