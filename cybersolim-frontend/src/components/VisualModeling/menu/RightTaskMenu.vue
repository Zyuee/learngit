<template>
  <context-menu class="right-menu"
                :target="target"
                :show="menuVisible"
                @update:show="(show) => menuVisible = show">
    <!--<a  @click="automate">复制</a>-->
    <!--<a v-if="graphType===Eclipse && graphName!==EclipseName && graphName!==SampleName && !hasData" @click="automate">automate</a>-->
    <!--<a v-if="graphType===Eclipse && graphName!==EclipseName && graphName!==SampleName && !hasFatherTask" @click="setData">set Data</a>-->
    <div v-if="graphType===Eclipse && graphName!==EclipseName && graphName!==SampleName && graphName!==EnvironmentName" >
      <a @click="setData">Set Data</a>
      <div class="menu_hr" />
    </div>
    <!--<a v-if="graphType===Rectangle && isMainTask" @click="open">OpenModel</a>-->

    <div v-if="graphType===Rectangle" >
      <a @click="setPara">Parameter</a>
      <div class="menu_hr" />
    </div>

    <div v-if="graphType===Eclipse && graphName===EclipseName || graphName === EnvironmentName">
      <a @click="setEnv">Covariates</a>
    </div>

    <div v-if="graphType===Rectangle && allowDelete" >
      <a @click="deleteModel">Delete</a>
      <div class="menu_hr" />
    </div>

    <div v-if="graphType===Eclipse && graphName===SampleName">
      <a @click="setSample">Data</a>
    </div>

    <div v-if="graphType===Rectangle && isMainTask">
      <a @click="checkFlow">Check</a>
      <div class="menu_hr" />
    </div>

    <a v-if="graphType===Eclipse && graphName===PatrolSampleName && !hasFatherTask" @click="automate(rMouseDownType)" >Automate by positional error mitigation method</a><!--//yrx-->
    <a v-else-if="graphType===Eclipse && graphName===VisitedSampleName && !hasFatherTask" @click="automate(rMouseDownType)" >Automate by representative location selection method</a><!--//yrx-->
    <div v-else-if="graphType===Eclipse && graphName!==EclipseName && graphName!==SampleName && graphName!== EnvironmentName && graphName!== CameraSampleName && !hasData && isCanDerive"  >
      <a @click="modelAutomate">Automate</a>
      <div class="menu_hr" />
    </div>

    <div v-if="graphType===Rectangle && isMainTask">
      <a @click="run">Run</a>
      <div class="menu_hr" />
    </div>

<!--    <div v-if="graphType===Rectangle && isMainTask" >-->
<!--      <a @click="save">Save</a>-->
<!--      <div class="menu_hr" />-->
<!--    </div>-->

  </context-menu>
</template>



<script>
  import {mapState} from 'vuex';
  import * as actionTypes from '../../../store/action-types'
  import KnowledgeBase from '../../knowledge/Knowledge_new';
  import Task from '../model/Task';
  import Data from '../model/Data';
  import Parameter from '../model/Parameter';
  import Connection from '../model/Connection';
  import GraphManager from '../model/GraphManager';
  import {modelingConst} from '../../constVariable';
  import { vIziToast } from '@/js/notify/v-iziToast';
  import axios from "axios";
  export default {
    data () {
      return {
        menuVisible:false,
        Eclipse:'',
        Rectangle:'',
        EclipseName:'',
        hasValue:false,
        SampleName:'',
        PatrolSampleName:'',
        VisitedSampleName:'',
        CameraSampleName:'',
        EnvironmentName:''
      }
    },
    mounted:function () {
      this.Eclipse = modelingConst.ELLIPSE;
      this.Rectangle = modelingConst.RECTANGLE;
      this.EclipseName = modelingConst.SOILENVIRONMENT;
      this.SampleName = modelingConst.HSM_SAMPLENAME;
      this.PatrolSampleName = modelingConst.PATROLSAMPLENAME;
      this.VisitedSampleName = modelingConst.VisitedSAMPLENAME;
      this.CameraSampleName = modelingConst.CameraSAMPLENAME;
      this.EnvironmentName = modelingConst.HSM_ENVIRONMENTNAME;
    },
    methods:{
      checkFlow(){
        //检查工作流是否完整
        this.$store.dispatch(actionTypes.SHOW_CHECK_WINDOW, true);
        this.menuVisible = false;
      },
      async run(){
        //如果是属于多环境因子的任务，则需要补充环境因子的类型
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
        if (!this.graphManager.checkWorkflowCanRun()){
          vIziToast.error("Can not run, Please check the workflow!");
          this.menuVisible = false;
          return;
        }
        //todo:能不能在这里将输入环境因子转移到主任务？
        let modeXML = this.graphManager.generateBPEL();
        this.graphManager.runModel(modeXML);
        //this.graphManager.topologySort();
        this.menuVisible = false;
      },

      save(){
        this.graphManager.saveBuildingModel();
        this.menuVisible = false;
      },

      setPara(){
        this.$store.dispatch(actionTypes.SHOW_PARA_WINDOW, true);
        this.menuVisible = false;
      },
      setEnv(){
        this.$store.dispatch(actionTypes.CURRENT_ELEMENT_NAME, this.graphName);
        this.$store.dispatch(actionTypes.HEADER_TITLE, 'Select your covariates');
        this.$store.dispatch(actionTypes.TRANSFER_TITLE, ['source covariate', 'target covariate']);
        this.$store.dispatch(actionTypes.GET_DATA_URL, '/semantic/listAllEnv');
        this.$store.dispatch(actionTypes.SHOW_ENV_WINDOW, true);
        this.menuVisible = false;
      },
      deleteModel(){
        // this.graphManager.deleteGraph(this.rMouseDownType);
        if(this.isMainTask){
          this.$store.dispatch(actionTypes.CLEAR_SELECTED_ITEM);//清空所有项的选择
          this.graphManager.deleteMainTask();
        }else{
          this.graphManager.deleteTask(this.rMouseDownType);
          this.graphManager.writeEnvsValues();
        }
        this.menuVisible = false;
      },
      async modelAutomate(){
        let seedData = this.rMouseDownType;
        let _this = this;
        let inputDatas = [];
        await _this.automate(seedData).then(res =>{
          inputDatas = res;
        }).catch(error =>{
          console.log(error);
        });

        //i控制迭代次数
        if (inputDatas !== null){
          for(let i = 0; i<50; i++){
            //console.log(i)
            //console.log("length",inputDatas.length);
              for(let j=0;j < inputDatas.length;j++){
                let inputData = inputDatas[j];
                // console.log(i);
                // console.log(inputDatas);
                if (inputData.canDerive > 0 ){
                  await _this.automate(inputData).then(res =>{
                    inputDatas = res;
                    //console.log("modelAutomateLength",j,inputDatas.length)
                    //console.log("modelAutomateData",j,inputDatas)
                  }).catch(error =>{
                    console.log(error);
                  });
                }

              }
          }
        }
      },
      async automate(currentData){
        this.menuVisible = false;
        let kb = new KnowledgeBase();
        //let taskname = kb.findTaskNameHasOutput(this.graph.dataName);
        let taskName = null;
        let inputNames = [];
        let inputDataFormat = [];
        let outputNames = [];
        let parameterNames = [];
        vIziToast.holdOn("searching algorithm for "  + currentData.dataName + ", please hold on", currentData.dataName);//使用id来独立控制应该关闭那个弹窗
        //todo: 现在只是实现一个输出数据对应一个算法，以后需要改为可能有多个算法对应一个输出数据，可以选择
        await kb.findTaskNameHasOutput(currentData.dataName,function (response) {
          let tasks = response.data;
          tasks.forEach(function (task) {
            taskName = task.algorithmName;
            let interfaces = task.algorithmInterfaceList;
            parameterNames = task.algorithmParameterList;
            interfaces.forEach(function (algorithmInterface) {
              if (algorithmInterface.input && !algorithmInterface.output){
                inputNames.push(algorithmInterface.name);
                inputDataFormat.push(algorithmInterface.inputDataFormat);
              }else if(!algorithmInterface.input && algorithmInterface.output){
                outputNames.push(algorithmInterface.name)
              }
            })
          })
        });
        let toast = document.querySelector('#'+currentData.dataName);//id选择器
        if(taskName===null){
          vIziToast.hide(toast);
          return;
        }

        let taskNameDuplicateCheckFlag = 0;
        // let inputNameDuplicateCheckFlag = 0;
        let _this = this;
        _this.graphManager.list.forEach((item)=>{
          //重复性检测，在新建任务时，如果canvas已有相同taskName，则不新建
          if (item.type === 'rectangle'){
            if(item.taskName === taskName)
            {
              taskNameDuplicateCheckFlag += 1;
              // console.log(item.taskName);
              // console.log(taskNameDuplicateCheckFlag);
            }
          }
          // //重复性检测，在新建任务时，如果canvas已有相同inputName，则不新建
          // if (item.type === 'ellipse'){
          //   inputNames.forEach((inputName)=>{
          //   if(item.dataName === inputName)
          //   {
          //     inputNameDuplicateCheckFlag += 1;
          //     // console.log(item.taskName);
          //     // console.log(taskNameDuplicateCheckFlag);
          //   }
          //   })
          // }
        });
        if (taskNameDuplicateCheckFlag ===0){
          vIziToast.hide(toast);
          let x_task = currentData.x + 150;
          let y_task = currentData.y;
          let newTask = new Task(x_task,y_task,100,50,taskName,this.graphManager.canvas,this.graphManager);
          this.graphManager.list.push(newTask);
          newTask.initAlgorithms();
          newTask.setDefaultAlgorithm();
          let algorithmName =  newTask.getSelectedAlgorithm().algorithmName;
          let inputDatas = [];
          let paras = [];
          let counter = -1;
          //标识任务关系逻辑：某个任务的下一个任务是先建的任务
          for(let i = 0;i < inputNames.length; i++){
            let flag = 0;
            for(let j=0;j<this.graphManager.list.length;j++){
              if(this.graphManager.list[j].type === "ellipse"){
                if(this.graphManager.list[j].dataName === inputNames[i]){
                  inputDatas.push(this.graphManager.list[j]);
                  flag = 1;
                  for(let k = 0; k< this.graphManager.list.length; k++){
                    if(this.graphManager.list[k].type === 'rectangle'){
                      if(this.graphManager.list[k].hasOutputData(this.graphManager.list[j]))
                      {
                        this.graphManager.list[k].addNextTask(newTask);
                      }
                    }
                  }
                }
              }
            }
            if(flag === 0){
              let x_data = currentData.x + 350;
              let y_data = currentData.y;
              let isCanDerive = await axios.get('./semantic/isCanDerive?semantic=' + inputNames[i]);//查询是否可派生
              let newData=new Data(x_data, y_data + counter * 50,40, 25, inputNames[i], isCanDerive.data.data, inputDataFormat[i], this.graphManager.canvas);
              this.graphManager.list.push(newData);
              inputDatas.push(newData);
              counter ++;
            }
          }
          //标识任务关系逻辑：先建的任务的下一个任务是某个任务
          for(let i = 0;i<this.graphManager.list.length;i++){
            if(this.graphManager.list[i].type === 'rectangle'){
              if(this.graphManager.list[i].hasInputData(currentData))
              {
                newTask.addNextTask(this.graphManager.list[i]);
              }
            }
          }
          // for(let i = 0; i < parameterNames.length; i++){
          //   let para = new Parameter(parameterNames[i].parameterName);
          //   paras.push(para);
          // }
          let outputDatas = [];
          outputDatas.push(currentData);
          //// begin of Sample Based Mapping
          let currentTask = null;
          for(let i =0; i<this.graphManager.list.length; i++){
            if(this.graphManager.list[i].type==='rectangle'&&this.graphManager.list[i].hasInputData(currentData)){
              currentTask = this.graphManager.list[i];
              break;
            }
          }
          let emptyInputDatas =[];
          //let emptyInputDatas = new Array();
          //console.log(inputDatas);
          for(let i = 0; i<inputDatas.length; i++){
            let inputData = inputDatas[i];
            let callDataUrl = "";
            //console.log(inputData);
            for (let j = 0; j < inputData.dataFormat.length; j++) {
              switch (inputData.dataFormat[j]) {
                case "Vector":
                  callDataUrl = "/dataSet/getSemanticVector?semantic=" + inputData.dataName + "&areaExtent=" + _this.mappingArea;
                  break;
                case "Raster":
                  callDataUrl = "/dataSet/getSemanticRaster?semantic=" + inputData.dataName + "&areaExtent=" + _this.mappingArea;
                  break;
                case "Table":
                  callDataUrl = "/dataSet/getUserSampleTable?semantic=" + inputData.dataName + "&areaExtent=" + _this.mappingArea;
                  break;
                case "Other":
                  break;
              }
              await _this.axios({
                url:callDataUrl,
                method:'get'
              }).then(response => {
                if (response.data.data != null && response.data.data.length !== 0) {
                  let defaultResponse = response.data.data[0];
                  // console.log(defaultResponse);
                  inputData.setValue([defaultResponse.filePath]);
                  inputData.check();
                  _this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: inputData.dataName, value: [0]});
                }
                else {
                  emptyInputDatas.push(inputData);
                }
              })
            }
          }
          newTask.setInputDatas(inputDatas);
          newTask.setOutputDatas(outputDatas);
          kb.setParametersDefaultValue(algorithmName,paras);
          newTask.setParameters(paras);
          let con = new Connection(newTask, currentData, this.graphManager.canvas);
          this.graphManager.list.push(con);
          for(let i=0;i<inputDatas.length;i++){
            let con = new Connection(inputDatas[i],newTask, this.graphManager.canvas);
            this.graphManager.list.push(con);
          }
          this.graphManager.reDraw(this.graphManager.list);
          //console.log(emptyInputDatas);
          //console.log(inputDatas);
          return emptyInputDatas ;
        }else{
          vIziToast.hide(toast);
          return [];
        }
      },
      setData(){
        if (this.graphName === this.PatrolSampleName ||
        this.graphName == this.VisitedSampleName ||
        this.graphName === this.CameraSampleName){
          this.$store.dispatch(actionTypes.HEADER_TITLE, 'select multi-data');
          this.$store.dispatch(actionTypes.IS_SINGLE_SELECT_TYPE, false);
        }else {
          this.$store.dispatch(actionTypes.HEADER_TITLE, 'select single-data');
          this.$store.dispatch(actionTypes.IS_SINGLE_SELECT_TYPE, true);
        }
        this.$store.dispatch(actionTypes.SHOW_DATA_WINDOW, true);
        this.menuVisible = false;
      },
      //yrx
      setSample(){
        this.$store.dispatch(actionTypes.CURRENT_ELEMENT_NAME, this.graphName);
        this.$store.dispatch(actionTypes.HEADER_TITLE, 'Select your data types');
        this.$store.dispatch(actionTypes.TRANSFER_TITLE, ['source data type', 'target data type']);
        this.$store.dispatch(actionTypes.GET_DATA_URL, '/Hsm/listAllSample');
        this.$store.dispatch(actionTypes.SHOW_ENV_WINDOW, true);
        this.menuVisible = false;
      },
      covariateAutomate(){
        let selectCovariateGroup = this.covariateSelected;
        let _this = this;
        if(selectCovariateGroup.length > 0){
          //不改成同步会重复创建inputData
          selectCovariateGroup.forEach(async (selectCovariateName) =>{
             await axios.get('./semantic/isCanDerive?semantic=' + selectCovariateName).then(
              (res)=>{
                //console.log(selectCovariateName,res)
                //covariate可以派生，则自动推理
                if(res.data.data > 0 ){
                  _this.graphManager.list.forEach((item)=>{
                    if (item.type === "ellipse"){
                      if(item.dataName === selectCovariateName)
                      {
                        _this.rMouseDownType = item;
                        _this.modelAutomate();
                      }
                    }
                  });
                }
                //covariate不可以派生，则有数据自动就设置数据
                else{
                  _this.graphManager.list.forEach((item)=>{
                    if (item.type === "ellipse"){
                      if(item.dataName === selectCovariateName)
                      {
                        let callDataUrl ="";
                        for (let j = 0; j < item.dataFormat.length; j++) {
                          switch (item.dataFormat[j]) {
                            case "Vector":
                              callDataUrl = "/dataSet/getSemanticVector?semantic=" + item.dataName + "&areaExtent=" + _this.mappingArea;
                              break;
                            case "Raster":
                              callDataUrl = "/dataSet/getSemanticRaster?semantic=" + item.dataName + "&areaExtent=" + _this.mappingArea;
                              break;
                            case "Table":
                              callDataUrl = "/dataSet/getUserSampleTable?semantic=" + item.dataName + "&areaExtent=" + _this.mappingArea;
                              break;
                            case "Other":
                              break;
                          }
                           _this.axios({
                            url:callDataUrl,
                            method:'get'
                          }).then(response => {
                            if (response.data.data != null && response.data.data.length !== 0) {
                              let defaultResponse = response.data.data[0];
                              // console.log(defaultResponse);
                              item.setValue([defaultResponse.filePath]);
                              item.check();
                              _this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: item.dataName, value: [0]});
                              _this.graphManager.reDraw(_this.graphManager.list);
                            }
                          })
                        }

                      }
                    }
                  });
                }
                //每次循环若res不重置，则会导致res.data.data没能重新赋值
                res = null;
              }
            );
          })
        }
      },
    },
    watch:{
       covariateFinished: function (finished) {
        if (finished) {
          this.covariateAutomate();
          //console.log("1")
          this.$store.dispatch(actionTypes.FINISH_COVARIATE,false);
        }
      },

    },
    computed:{
      ...mapState({
        graphManager: state => state.ModelState.graphMangerState,
        initTaskName:state => state.ModelState.methodName,
        mappingArea: state => state.MapState.clickGeometry,
        covariateSelected: state => state.ModelState.covariateSelected,
        covariateFinished: state => state.ModelState.covariateFinished,
      }),
      graphType () {
        if (this.rMouseDownType !==null){
          return this.rMouseDownType.type
        }
      },
      graphName(){
        if (this.rMouseDownType !== null){
          return this.rMouseDownType.dataName
        }
      },
      hasData(){
        this.rMouseDownType.check();
        if (this.rMouseDownType.hasValue){
          return true;
        }else {
          return false;
        }
      },
      isCanDerive(){
        return this.rMouseDownType.isCanDerive();
      },
      hasFatherTask(){
        let flag = this.graphManager.checkDataHasFatherTask(this.rMouseDownType).flag;
        return flag;
      },
      allowDelete(){
        let outputName = this.rMouseDownType.getSelectedAlgorithm().outputDatas[0].dataName;
        if(outputName === this.EclipseName ||
          outputName === this.SampleName ||
          outputName === this.EnvironmentName){
          return false;
        }
        return true;
      },
      isMainTask(){
        if(this.rMouseDownType.taskName === this.initTaskName ){
          return true;
        }
        return false;
      },
    },
    props:{
      target:null,
      //menuVisible:Boolean,
      manager:null,
      rMenuPosition:null,
      rMouseDownType:null
    }
  }
</script>
<style>
  .right-menu {
    position: fixed;
    background: #fff;
    border: solid 1px rgba(0, 0, 0, .2);
    border-radius: 3px;
    z-index: 999;
    display: none;
  }
  .right-menu a {
    width: 150px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
  }
  .right-menu a:hover {
    background: #eee;
    color: #fff;
  }
  .right-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    border-radius: 1px;
  }
  a {
    text-decoration: none;
  }
  .right-menu a {
    padding: 2px;
  }
  .right-menu a:hover {
    background: #42b983;
  }
  .menu_hr {
    height: 1px;
    border-top: 1px solid #bbb;
    margin: 3px 10px;
  }
</style>
