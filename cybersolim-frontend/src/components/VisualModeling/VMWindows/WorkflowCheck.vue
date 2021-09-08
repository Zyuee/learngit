<template>
  <div>
    <j-panel :options="panelOptions" :show="show">
      <Form :label-width="270" label-position="left">
      <Scroll height="210" loading-text="loading">
        <!--<div style="width: 600px">-->
          <!--<p>TaskName: Habitat Mapping</p>-->
          <!--<p>&nbsp;&nbsp;Input: </p>-->
          <!--<p>&nbsp;&nbsp;&nbsp;&nbsp;Covariance: DEM, Slope, Aspect</p>-->
          <!--<p>&nbsp;&nbsp;&nbsp;&nbsp;Sample: test</p>-->
          <!--<p>&nbsp;&nbsp;Parameter: </p>-->
          <!--<p>&nbsp;&nbsp;&nbsp;&nbsp;Parameter1: 100</p>-->
          <!--<p>&nbsp;&nbsp;&nbsp;&nbsp;Parameter2: 200</p>-->
          <!--<p>&nbsp;&nbsp;Output: </p>-->
          <!--<p>&nbsp;&nbsp;&nbsp;&nbsp;HabitatMap: myHabitatMap</p>-->
        <!--</div>-->
        <!--{{workflowInfo}}-->
        <task-info v-for="(item, index) in workflowInfo" :key="index" :task="item" :index="index"></task-info>
      </Scroll>
      <Row align="middle" style="margin-top: 10px" class="button-form">
        <Button icon="md-checkmark" type="primary" @click="run" :disabled="isDisabled">Run</Button>
        <Button icon="md-close" @click="closeThis">Cancel</Button>
      </Row>
     </Form>
    </j-panel>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import JPanel from '../../widgets/JSPanel'
  import { vIziToast } from '@/js/notify/v-iziToast'
  import TaskInfo from '../model/TaskInfo.vue'
  import {modelingConst} from '../../constVariable';

  export default {
    name: "workflow_check",
    data(){
      return {
        panelOptions: {
          id: 'workflow_check',
          theme: 'primary',
          paneltype: 'modal',
          headerTitle: 'check workflow information',
          draggable: true,
          contentSize: {
            width: 670,
            height: 300
          },
          onclosed: this.closeThis
        },
        workflowInfo: [],
        isDisabled: true
      }
    },
    components: {
      JPanel,
      TaskInfo
    },
    methods: {
      closeThis () {
        this.$store.dispatch(actionTypes.SHOW_CHECK_WINDOW, false)
      },
      async run(){
        if (this.graphManager.checkHasCovariateSetting()){
          let rasterDataList = this.graphManager.checkEnvs();//只是获得语义名称
          let envTypeResponse = await this.axios.get('./semantic/getSemanticType?semanticNames='+rasterDataList);
          let envTypeData = envTypeResponse.data.data;
          let envRules = "";
          for (let i = 0; i < rasterDataList.length; i++){
            if (envRules === ""){
              envRules = envTypeData[i];
            }else {
              envRules = envRules + modelingConst.PATHSPLIT  + envTypeData[i];
            }
          }
          this.graphManager.setCovariatesDataType([envRules]);
        }
        // if(this.graphManager.checkHasSoilSample()){
        //   this.graphManager.setSoilSampleProperty([this.soilProperty]);
        // }
        //todo:能不能在这里将输入环境因子转移到主任务？
        let modeXML = this.graphManager.generateBPEL();
        this.graphManager.runModel(modeXML);
        this.closeThis();
      }
    },
    watch:{
      show:function () {
        if (this.show){
          this.workflowInfo = this.graphManager.topologySort();
          this.isDisabled = !this.graphManager.checkWorkflowCanRun();//如果流程跑通则返回true，因此这里需要取反
        }
      }
    },
    computed: {
      ...mapState({
        show: state => state.ModelState.showCheckWindow,
        graphManager: state => state.ModelState.graphMangerState,
        // soilProperty: state => state.DataState.soilProperty
      })
    },
    props:{
      currentTask:null,
    },
  }
</script>

<style lang="scss" scoped>
  .button-form {
    text-align: center;
    padding: 20px;
  }
</style>
