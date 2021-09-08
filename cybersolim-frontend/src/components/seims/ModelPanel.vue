<!--
modeling panel
-->
<template>
  <div>
   <!-- <model-upload-data :data-set-id="datasetId" :show-upload="showUpload"
                       @close="closeUpload"/>-->
    <model-select :model-show="showModelSelect" @close="closeModelSelect"
                  @reloadModel="reloadModel"/>
    <j-panel :options="panelOptions" :show="show">
      <vue-toolbar :items="toolbar"
                   class="data-toolbar model-toolbar"></vue-toolbar>
      <div class="step-content">
        <Steps :current="current" style="margin: 8px">
          <Step title="Customise Model Structure">
          </Step>
          <Step title="Prepare Model Inputs">
          </Step>
          <Step title="Pre-process Input Data">
          </Step>
        </Steps>
        <Divider style="margin: 10px"/>
        <ModelStructure v-if="current===0" :reload-model-id="modelId"
                        @update="update"></ModelStructure>
        <ModelInputPrepare :spatial-data-id="spatialDataId" v-if="current===1"
                           :modelId="modelId"></ModelInputPrepare>
        <div v-if="current===2" style="height: 300px"></div>
        <Button type="success" @click="pre" :disabled="disabled"
                class="previous">
          <Icon type="ios-arrow-back"/>
          Previous step
        </Button>
        <Button type="success" @click="next" class="next">Next step
          <Icon type="ios-arrow-forward"/>
        </Button>
      </div>
    </j-panel>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import JPanel from '@/components/widgets/JSPanel'
  import * as actionTypes from '@/store/action-types'
  import {vIziToast} from "../../js/notify/v-iziToast";
  import ModelSelect from "./ModelSelect";
  import ModelStructure from "./ModelStructure";
  import ModelInputPrepare from "./ModelInputPrepare";
  import ModelUploadData from "./ModelUploadData";
  import VueToolbar from "../widgets/toolbar/Toolbar";
  import downloadUtils from "../../js/downloadUtils";

  export default {
    name: 'seims-model-panel',
    data() {
      return {
        toolbar: [
          {
            title: 'open model',
            click: this.selectModel,
            icon: 'md-folder-open',
            size: 17,
            text: 'Open Model'
          },
         /* {
            title: 'upload data',
            click: this.uploadData,
            icon: 'md-cloud-upload',
            size: 17,
            text: 'Upload Model Data'
          }, */
          {
            title: 'refresh',
            click: this.refresh,
            icon: 'md-refresh',
            text: 'Refresh Data'
          }
        ],
        panelOptions: {
          headerTitle: 'Watershed Modeling',
          theme: 'primary',
          contentSize: {
            width: 770,
            height: 450
          },
          headerControls: {
            maximize: 'remove'
          },
          onclosed: this.closeThis,
          animateOut: 'jsPanelFadeOut',
          resizeit: {handles: 'e,w', minWidth: 600},
          footerToolbar: [
            '<span class="jsPanel-ftr-btn" id="exampleBtn"><a href="javascript:void(0)"><i class="ivu-icon ivu-icon-md-cloud-download"></i>Example files</a></span>',
            ' <span class="jsPanel-ftr-btn"><a href="https://github.com/lreis2415/SEIMS" target="_blank">' +
            '<i class="ivu-icon ivu-icon-ios-link-outline"></i>SEIMS at Github</a></span>'
          ],
          callback: (panel) => {
            // handler for the icons
            for (const btn of panel.footer.querySelectorAll('span#exampleBtn')) {
              btn.addEventListener('click', (e) => {
                downloadUtils.downloadFile('post', '/seims/download/example',
                  null, 'application/zip');
              });
            }
          }
        },
        current: 0,
        modelId: -1,
        spatialDataId: -1,
        showUpload: false,
        showModelSelect: false,
        disabled: true
      }
    },
    components: {
      JPanel,
      VueToolbar,
      ModelSelect,
      ModelStructure,
      ModelInputPrepare,
     // ModelUploadData
    },
    methods: {
      closeThis() {
        this.$store.dispatch(actionTypes.SHOW_SEIMS_MODEL, false);
      },
    /*  uploadData() {
        this.showUpload = true;
      },
      closeUpload() {
        this.showUpload = false;
      },*/
      closeModelSelect() {
        this.showModelSelect = false;
      },
      update(ids) {
        this.modelId = ids.modelId;
        this.spatialDataId = ids.spatialDataId;
      },
      reloadModel(selectedModelId) {
        this.modelId = selectedModelId;
        console.log(this.modelId);
      },
      selectModel() {
        this.showModelSelect = true;
        // vIziToast.info("We are working on it, coming soon...")
      },
      refresh() {
        vIziToast.info("We are working on it, coming soon...");
        // 刷新用户上传数据界面内容：ModelInputPrepare.vue
      },
      next() {
        if (this.current === 2) {
          this.current = 0;
          this.disabled = true;
        } else {
          this.current += 1;
          this.disabled = false;
        }
      },
      pre() {
        if (this.current === 0) {
          this.disabled = true;
        } else {
          this.current -= 1;
          this.disabled = false;
        }
      }
    },
    computed: {
      ...mapState({
        show: state => state.SeimsState.showSeimsModel,
        baseMap: state => state.basemap
      })
    }
  }
</script>

<style lang="scss" scoped>
  .step-content {
    position: absolute;
    top: 2.3rem;
    width: 100%;
  }

  $bottom: 10px;
  .previous {
    position: absolute;
    left: 20px;
  }

  .next {
    position: absolute;
    right: 20px;
  }
</style>
