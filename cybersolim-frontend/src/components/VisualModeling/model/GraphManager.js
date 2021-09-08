/**
 * Created by lp on 2017/6/16.
 */

import CoordinateT from './CoordinateT';
import Data from './Data';
import Task from './Task';
import Parameter from './Parameter';
import Connection from './Connection';
import KnowledgeBase from '../../knowledge/Knowledge_new';
import axios from 'axios';
import {modelingConst} from '../../constVariable';
import { vIziToast } from '@/js/notify/v-iziToast';
import * as actionTypes from "../../../store/action-types";
import store from '../../../store/index';
import Qs from 'qs'
import {reconstructEllipse, reconstructRectangle, reconstructArrow} from './SimpleElement'

export default class GraphManager{
  constructor(canvas){
    this.canvas = canvas;
    this.list = [];
    this.current = null;  //记录鼠标右键选中的对象
    this.currentLR = null;//记录鼠标点击选中的对象（不分左右键）
    this.currentPre = null;
    //获取推测性制图的环境变量
    this.selectedLayersItems = [];//todo:这个变量在GeoExt.js文件中也存在
    this.currentTask = null;
    // //用来存储参数设置窗体中的参数，设计目的：因为在init时，必须调用axios来查找该task的参数，因为用户不打开参数
    // //设计窗口，我们也必须要给任务一个默认参数设计，但是有些参数往往涉及可选项，所以原方法中调用的getAlgorithmParameter,缺少一些信息
    // // 所以，为了减少对后台的调用，我们在这里又设计一个变量，来存贮后台传输上来的参数原始信息
    // this.currentParameter = [];
  }
  findInitInputDatas(){
    let taskList =[];
    let dataList =[];
    let initdataList=[];
    for(let i= 0; i < this.list.length; i++){
      if(this.list[i].label === 'Env.Layers ManageMent'){
        continue;
      }
      if("rectangle" === this.list[i].type){
        taskList.push(this.list[i]);
      }else if("ellipse" === this.list[i].type){
        dataList.push(this.list[i]);
      }
    }
    for(let i =0; i<dataList.length;i++){
      let flagin = false;
      let flagout = false;
      for(let j = 0; j < taskList.length; j++){
        if(taskList[j].hasInputData(dataList[i])){
          flagin = true;
        }else if(taskList[j].hasOutputData(dataList[i])){
          flagout = true;
        }
      }
      if(flagin=== true && flagout === false){
        initdataList.push(dataList[i]);
      }
    }
    return 	initdataList;
  }

  openModelJJC(xmlstr){
    let modeXML = xmlstr;
    this.list = [];
    let domParser = new  DOMParser();
    let xmlDoc = domParser.parseFromString(modeXML, 'text/xml');
    let datas = xmlDoc.getElementsByTagName("data");
    let tasks = xmlDoc.getElementsByTagName("task");

    let datalist = []; //数据列表
    let tasklist = []; //任务列表
    // draw data node
    for(let i = 0; i < datas.length; i++){

      let x = datas[i].getElementsByTagName("x")[0].firstChild.nodeValue;
      let y = datas[i].getElementsByTagName("y")[0].firstChild.nodeValue;
      let a = datas[i].getElementsByTagName("a")[0].firstChild.nodeValue;
      let b = datas[i].getElementsByTagName("b")[0].firstChild.nodeValue;
      let label = datas[i].getElementsByTagName("label")[0].firstChild.nodeValue;
      let drawData = new Data(Number(x),Number(y),Number(a),Number(b),label,this.canvas);
      if(datas[i].getElementsByTagName("value")[0].firstChild === null){
        drawData.hasValue = false;
        let value = [];
        drawData.setValue(value);
      }else{
        let	data_value = datas[i].getElementsByTagName("value")[0].firstChild.nodeValue;
        drawData.hasValue = true;
        let value = [];
        value.push(data_value);
        drawData.setValue(value);
      }
      datalist.push(drawData);
    }
    // draw task node
    for(let i =0;i<tasks.length;i++){
      let x = tasks[i].getElementsByTagName("x")[0].firstChild.nodeValue;
      let y =  tasks[i].getElementsByTagName("y")[0].firstChild.nodeValue;
      let width = tasks[i].getElementsByTagName("a")[0].firstChild.nodeValue;
      let height = tasks[i].getElementsByTagName("b")[0].firstChild.nodeValue;
      let label = tasks[i].getElementsByTagName("label")[0].firstChild.nodeValue;
      let drawTask = new Task(Number(x),Number(y),Number(width),Number(height),label,this.canvas,this);
      drawTask.isReadyToRun = false;
      tasklist.push(drawTask);
    }


    for(let i =0;i<tasklist.length;i++){
      let algorithmName = tasks[i].getElementsByTagName("algorithm")[0].firstChild.nodeValue;
      let inputnames = tasks[i].getElementsByTagName("inputdata")[0].firstChild.nodeValue.split('$');
      let outputnames = tasks[i].getElementsByTagName("outputdata")[0].firstChild.nodeValue.split('$');
      let parameter_name_values ;
      if(tasks[i].getElementsByTagName("parameter")[0].firstChild === null){
        parameter_name_values = [];
      }else{
        parameter_name_values = tasks[i].getElementsByTagName("parameter")[0].firstChild.nodeValue.split('$') ;
      }

      let inputdatas = [];
      let outputdatas = [];
      let parameters = [];

      let _task = tasklist[i];
      _task.initAlgorithms();
      _task.setAlgorithm(algorithmName);

      for(let t = 0;t<inputnames.length;t++){
        for(let k = 0;k<datalist.length;k++){
          if(datalist[k].dataName ===inputnames[t]){
            inputdatas.push(datalist[k]);
          }
        }
      }
      let taskName = tasks[i].getElementsByTagName("label")[0].firstChild.nodeValue;
      if( taskName === 'Sample Based Mapping'){
        this.selectedLayersItems = [];
        for(let t=0; t<inputnames.length; t++){
          let inputname = inputnames[t];
          if(inputname==='Precipitation'||inputname==='Temperature'||inputname==='Evaporation'){
            this.selectedLayersItems.push("Climate#" + inputname);
          }else if(inputname==='Parent Material'){
            this.selectedLayersItems.push("Geology#" + inputname);
          }else if(inputname==='TWI'||inputname==='Slope Gradient'||inputname==='Profile Curvature'||inputname=='Plan Curvature'){
            this.selectedLayersItems.push("Terrain#" + inputname);
          }else if(inputname ==='NDVI'){
            this.selectedLayersItems.push("Vegetation#" + inputname);
          }else if(inputname ==='Albedo'||inputname ==='Watershed'){
            this.selectedLayersItems.push("Others#" + inputname);
          }
        }
      }

      for(let t = 0;t<outputnames.length;t++){
        for(let k = 0;k<datalist.length;k++){
          if(datalist[k].dataName ===outputnames[t]){
            outputdatas.push(datalist[k]);
          }
        }
      }

      for(let t = 0; t<parameter_name_values.length; t++){
        let name_value = parameter_name_values[t].split(':');
        let name = name_value[0];
        let value = name_value[1];
        let para =  new Parameter(name);
        let _value = [];
        _value.push(value);
        para.setValue(_value);
        parameters.push(para);

      }

      _task.setInputDatas(inputdatas);
      _task.setOutputDatas(outputdatas);
      _task.setParameters(parameters);
      // draw connection
      for(let k=0; k< inputdatas.length;k++){
        let con = new Connection(inputdatas[k], _task, this.canvas);
        con.isReady = true;
        this.list.push(con);

      }
      //draw connection
      for(let k=0; k< outputdatas.length;k++){
        let con = new Connection(_task,outputdatas[k], this.canvas);
        con.isReady = true;
        this.list.push(con);
      }

    }// end of for
    let myflag = 0;
    for(let i=0;i<tasklist.length;i++){
      let _task = tasklist[i];
      let outputdatas = _task.selectedAlgorithm.outputDatas;
      myflag =0;
      for(let t = 0;t<outputdatas.length;t++){
        for(let k = 0;k<tasklist.length;k++){
          if(tasklist[k].hasInputData(outputdatas[t])){
            myflag =1;
            _task.addNextTask(tasklist[k]);
          }
        }
      }
      if(myflag ===0){
        this.currentTask = _task.taskName;

      }
    }//end of for

    for(let i =0;i<datalist.length;i++){
      this.list.push(datalist[i]);
    }
    for(let i =0;i<tasklist.length;i++){
      this.list.push(tasklist[i]);
    }

    this.reDraw();
  }

  //jjc版本在函数内部调用ajax保存modexml，改后只是返回modelxml，在页面中再调用ajax保存
  //save模型包括保存数据和任务
  saveModelJJC(modelname){
    let initdataList = this.findInitInputDatas();

    let modeXML = '<?xml version="1.0" encoding="utf-8" ?>';
    modeXML = modeXML + '<model name= "' + modelname+ '">';
    for(let i =0;i< this.list.length;i++){
      if(this.list[i].type==="ellipse"){
        modeXML = modeXML + '<data>'
          +'<x>'+this.list[i].x+'</x>'
          +'<y>'+this.list[i].y+'</y>'
          +'<a>'+this.list[i].a+'</a>'
          +'<b>'+this.list[i].b+'</b>'
          +'<label>'+this.list[i].label+'</label>';
        let flag = false;
        for(let k =0; k< initdataList.length; k++){
          if(initdataList[k].label === this.list[i].label){
            flag = true;
          }
        }
        if(flag === true){
          modeXML = modeXML + '<value></value>'+'</data>';
        }else{
          modeXML = modeXML + '<value>'+this.list[i].value()[0]+'</value>'+'</data>';
        }

      }else if(this.list[i].type==="rectangle"){
        let paras = this.list[i].getSelectedAlgorithm().parameters;
        let parastr = "" ;

        if(paras.length>0){
          parastr = paras[0].parametername + ':' + paras[0].value[0];
          for(let k =1; k< paras.length; k++){
            parastr = parastr + '$' + paras[k].parametername + ':' + paras[k].value[0];
          }
        }

        let inputdatas = this.list[i].getSelectedAlgorithm().inputDatas;
        let inputstr = "";
        if(inputdatas.length>0){
          inputstr = inputdatas[0].dataName;
          for(let k = 1; k< inputdatas.length; k ++){
            inputstr =  inputstr + '$' + inputdatas[k].dataName ;
          }
        }
        let outputdatas = this.list[i].getSelectedAlgorithm().outputDatas;

        let outputstr = "";
        if(outputdatas.length>0){
          outputstr = outputdatas[0].dataName;

          for(let k = 1; k< outputdatas.length; k ++){
            outputstr =  outputstr + '$' + outputdatas[k].dataName ;
          }
        }

        modeXML = modeXML + '<task>'
          +'<x>'+this.list[i].x+'</x>'
          +'<y>'+this.list[i].y+'</y>'
          +'<width>'+this.list[i].a+'</width>'
          +'<height>'+this.list[i].b+'</height>'
          +'<label>'+this.list[i].label+'</label>'
          +'<algorithm>'+this.list[i].getSelectedAlgorithm().algorithmName+'</algorithm>'
          +'<parameter>' + parastr + '</parameter>'
          +'<inputdata>' + inputstr + '</inputdata>'
          +'<outputdata>' + outputstr + '</outputdata>'
          +'</task>';
      }

    }
    modeXML = modeXML +"</model>";
    return modeXML;
  }

  topologySort(){
    let taskList = [];
    let sortedTaskList = [];
    //找到全部的任务列表
    for(let i = 0;i < this.list.length;i++){
      if("rectangle" === this.list[i].type){
        taskList.push(this.list[i]);
      }
    }
    //遍历任务列表，找到第一个任务
    let first = null;
    for(let i=0;i<taskList.length;i++){
      let flag =0;
      for (let j =0;j<taskList.length; j++){
        if(taskList[j].taskIsNextTask(taskList[i])){
          flag = 1;
        }
      }
      if(flag===0){
        first = taskList[i];
        break;
      }
    }
    //排除头结点后，不断遍历寻找下一个头结点
    while(first){
      sortedTaskList.push(first);
      let temp0 = [];
      for(let k =0; k < taskList.length; k++){
        if(taskList[k] !== first)
          temp0.push(taskList[k]);
      }
      taskList = temp0;
      first = null;
      for(let i=0;i<taskList.length;i++){
        let flag =0;
        for (let j =0;j<taskList.length; j++){
          if(taskList[j].taskIsNextTask(taskList[i])){
            flag = 1;
          }
        }
        if(flag===0){
          first = taskList[i];
          break;
        }
      }

    }
    return sortedTaskList;
  }

  checkWorkflowCanRun(){
    let taskList = this.topologySort();
    for (let task of taskList) {
      for (let input of task.getSelectedAlgorithm().inputDatas)
        if (input.value.length == 0 && input.valueFromPreTask.length == 0) return false;

      for (let parameter of task.getSelectedAlgorithm().parameters)
        if (parameter.value.length == 0 || parameter.value[0] == undefined ) return false;

      for (let output of task.getSelectedAlgorithm().outputDatas)
        if (output.value.length == 0 && output.valueFromPreTask.length == 0) return false;
    }
    return true;
  }

  async generateBPEL() {
    let taskList = this.topologySort();
    let modeXML = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    modeXML = modeXML + '<model>';
    for (let k = 0; k < taskList.length; k++) {
      let task = taskList[k];
      let algorithm = task.getSelectedAlgorithm();
      let inputDatas = [];
      let outputDatas = [];
      let paras = [];
      inputDatas = algorithm.inputDatas;
      outputDatas = algorithm.outputDatas;
      paras = algorithm.parameters;
      modeXML = modeXML + '<task taskName = \'' + task.taskName + '\'>';
      modeXML = modeXML + '<algorithm algorithmName = \'' + algorithm.algorithmName + '\'>';
      if (task.taskName === "Covariate_Setting") {//特殊的任务1
        modeXML = modeXML + '<data>';
        modeXML = modeXML + '<dataKind>';
        modeXML = modeXML + 'InputData';
        modeXML = modeXML + '</dataKind>';
        modeXML = modeXML + '<dataName>';
        modeXML = modeXML + 'inputLayerPath';//按照参数名称设置，缺点：需要和webservice中的参数名称对应上
        modeXML = modeXML + '</dataName>';
        modeXML = modeXML + '<dataValue>';
        let hasValue = false;//默认没有dataValue
        for (let i = 0; i < inputDatas.length; i++) {
          let inputData = inputDatas[i];
          if (inputData.value.length > 0){
            for (let j = 0; j < inputData.value.length; j++) {
              modeXML = modeXML + inputData.value[j];
              modeXML = modeXML + '#';
              hasValue = true;
            }
          }else if (inputData.valueFromPreTask.length > 0){
            for (let j = 0; j < inputData.valueFromPreTask.length; j++) {
              modeXML = modeXML + inputData.valueFromPreTask[j];
              modeXML = modeXML + '#';
              hasValue = true;
            }
          }
        }
        if(hasValue){
          modeXML = modeXML.slice(0, modeXML.length - 1);//截取后面的#符号
        }
        modeXML = modeXML + '</dataValue>';
        modeXML = modeXML + '</data>';
      } else if (task.taskName === "Data_Check_or_Integration_Service") {//特殊的任务2
        modeXML = modeXML + '<data>';
        modeXML = modeXML + '<dataKind>';
        modeXML = modeXML + 'InputData';
        modeXML = modeXML + '</dataKind>';
        modeXML = modeXML + '<dataName>';
        modeXML = modeXML + 'inSamplesPath';//按照参数名称设置，缺点：需要和webservice中的参数名称对应上
        modeXML = modeXML + '</dataName>';
        modeXML = modeXML + '<dataValue>';
        let hasValue = false;//默认没有dataValue
        for (let i = 0; i < inputDatas.length; i++) {
          let inputData = inputDatas[i];
          for (let j = 0; j < inputData.value.length; j++) {
            modeXML = modeXML + inputData.value[j];
            modeXML = modeXML + '#';
            hasValue = true;
          }
          for (let j = 0; j < inputData.valueFromPreTask.length; j++) {
            modeXML = modeXML + inputData.valueFromPreTask[j];
            modeXML = modeXML + '#';
            hasValue = true;
          }
        }
        if (hasValue) {
          modeXML = modeXML.slice(0, modeXML.length - 1);//截取后面的#符号
        }
        modeXML = modeXML + '</dataValue>';
        modeXML = modeXML + '</data>';
      } else {
        for (let i = 0; i < inputDatas.length; i++) {
          let inputData = inputDatas[i];
          modeXML = modeXML + '<data>';
          modeXML = modeXML + '<dataKind>';
          modeXML = modeXML + 'InputData';
          modeXML = modeXML + '</dataKind>';
          modeXML = modeXML + '<dataName>';
          modeXML = modeXML + inputData.dataName;//普通的任务根据输入名称确定参数
          modeXML = modeXML + '</dataName>';
          modeXML = modeXML + '<dataValue>';
          let hasValue = false;//默认没有dataValue
          for (let j = 0; j < inputData.value.length; j++) {
            modeXML = modeXML + inputData.value[j];
            modeXML = modeXML + '#';
            hasValue = true;
          }
          for (let j = 0; j < inputData.valueFromPreTask.length; j++) {
            modeXML = modeXML + inputData.valueFromPreTask[j];
            modeXML = modeXML + '#';
            hasValue = true;
          }
          if (hasValue){//如果有值的话，说明存在多一个#符号，需要截取
            modeXML = modeXML.slice(0, modeXML.length - 1);//截取后面的#符号
          }
          modeXML = modeXML + '</dataValue>';
          modeXML = modeXML + '<dataFormat>';
          modeXML = modeXML + inputData.dataFormat;
          modeXML = modeXML + '</dataFormat>';
          modeXML = modeXML + '</data>';
        }
      }
      // 如果没有设置参数，直接读本体文件里的默认参数
      if (paras.length == 0) {
        let paraResponse = await axios.get('./algorithm/findAlgorithmParameter?serviceName=' + task.taskName);
        paras = paraResponse.data.data;
        for (let i = 0; i < paras.length; i++) {
          let para = paras[i];
          modeXML = modeXML + '<data>';
          modeXML = modeXML + '<dataKind>';
          modeXML = modeXML + 'Parameter';
          modeXML = modeXML + '</dataKind>';
          modeXML = modeXML + '<dataName>';
          modeXML = modeXML + para.parameterName;
          modeXML = modeXML + '</dataName>';
          modeXML = modeXML + '<dataValue>';
          modeXML = modeXML + para.parameterValue[0];
          modeXML = modeXML + '</dataValue>';
          modeXML = modeXML + '</data>';
        }
      } else {
        for (let i = 0; i < paras.length; i++) {
          let para = paras[i];
          modeXML = modeXML + '<data>';
          modeXML = modeXML + '<dataKind>';
          modeXML = modeXML + 'Parameter';
          modeXML = modeXML + '</dataKind>';
          modeXML = modeXML + '<dataName>';
          modeXML = modeXML + para.parametername;
          modeXML = modeXML + '</dataName>';
          modeXML = modeXML + '<dataValue>';
          modeXML = modeXML + para.value[0];
          modeXML = modeXML + '</dataValue>';
          modeXML = modeXML + '</data>';
        }
      }
      for (let i = 0; i < outputDatas.length; i++) {
        let outputData = outputDatas[i];
        modeXML = modeXML + '<data>';
        modeXML = modeXML + '<dataKind>';
        modeXML = modeXML + 'OutputData';
        modeXML = modeXML + '</dataKind>';
        modeXML = modeXML + '<dataName>';
        modeXML = modeXML + outputData.dataName;
        modeXML = modeXML + '</dataName>';
        modeXML = modeXML + '<dataValue>';
        modeXML = modeXML + outputData.valueFromPreTask[0];
        modeXML = modeXML + '</dataValue>';
        modeXML = modeXML + '<dataFormat>';
        modeXML = modeXML + outputData.dataFormat;
        modeXML = modeXML + '</dataFormat>';
        modeXML = modeXML + '</data>';
      }
      modeXML = modeXML + '</algorithm>';
      modeXML = modeXML + '</task>';
    }
    modeXML = modeXML + '</model>';
    //console.log(modeXML);
    return modeXML;
  }
  async runModel(modeXML)
    {
      vIziToast.holdOn("calculating, please hold on");
      let toast = document.querySelector('.iziToast');
      //传过来的modeXML是一个Promise，不是字符串
      let modeInfoXML = await modeXML
        .then()
        .catch(err =>{
          console.log(err)
        });
      // console.log(modeInfoXML);
      await axios({
        url: "/workflow/run",
        method: "POST",
        data: modeInfoXML,
        headers: {
          'Content-Type': 'application/xml'  //如果写成contentType会报错
        }
      }).then(response => {
        let runResultInfo = response.data.msg;
        if (runResultInfo === 'success') {
          //运行成功，自动保存
          // console.log(response.data.data);
          // console.log(typeof response.data.data);
          this.saveBuildingModel(null,response.data.data);
//          store.dispatch(actionTypes.REFRESH_PROJECTS, true);
          vIziToast.hide(toast);
          vIziToast.success('run model successfully',2000);
          // jspanel 的name属性，短划线改为下划线
          let modelPanel = document.getElementById('models_table');
          // 最小化
          modelPanel.minimize();
          store.dispatch(actionTypes.REFRESH_PROJECTS, true);
          setTimeout(function(){
            store.dispatch(actionTypes.RUN_MODEL_FINISHED,true);
          },500);
        } else {
          vIziToast.hide(toast);
          vIziToast.error("run model failure");
        }
      })
    }

  recordModelDomain(domain){
    this.domainName = null;
    this.domainName = domain;
  }
  recordModelArea(area){
    this.modelArea = null;
    this.modelArea = area;
  }

  async saveBuildingModel(inputModelName, runModelId){
    vIziToast.holdOn("saving, please hold on");
    let toast = document.querySelector('.iziToast');
    let newList = [];
    let sortTaskList = this.topologySort();
    //console.log(sortTaskList);
    newList.push({mainTask: sortTaskList[sortTaskList.length-1].taskName});

    this.list.forEach((item)=>{
      if(item.type === 'rectangle'){
        newList.push(reconstructRectangle(item));
      }
      if (item.type === 'ellipse'){
        let selectItems = store.getters.getSelectedItem(item.dataName);//保存当前输入数据的编号
        if (selectItems.length > 0){
          item.selectedItems = selectItems[0].value;
        }else {
          item.selectedItems = [];
        }
        newList.push(reconstructEllipse(item));
      }
      if (item.type === 'arrow'){
        newList.push(reconstructArrow(item));
      }
    });
    let jsonModelStr = JSON.stringify(newList);
    let modelDomain = this.domainName.toString();
    let modelArea = this.modelArea.toString();
    let data = {"model":jsonModelStr, "modelDomain":modelDomain, "modelArea":modelArea, "inputModelName":inputModelName, "runModelId": runModelId};
    axios.post("/model/save", Qs.stringify(data)).then((response) =>{
      let saveResultInfo = response.data.msg;
      if (saveResultInfo === 'success') {
        vIziToast.hide(toast);
        vIziToast.success("model has been save into User's Models");
      } else {
        vIziToast.hide(toast);
        vIziToast.error("save model failure");
      }
    });
  }

  openBuildingModel(modelDetailList){
    store.dispatch(actionTypes.INIT_TASK_Method, modelDetailList[0].mainTask);
    modelDetailList.splice(0,1);//删除首个信息
    let dataList = [];
    let taskList = [];
    let connectionList = [];
    // 先复现所有输入/输入
    modelDetailList.forEach((item)=> {
      if (item.type === "ellipse") {
        let data = new Data(item.x, item.y, item.a, item.b, item.label, item.canDerive, item.dataFormat, this.canvas);
        data.setValue(item.value);
        data.setValueFromPreTask(item.valueFromPreTask);
        store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: item.label, value: item.selectedItems});
        dataList.push(data);
      }
    });
    // 再复现任务
    modelDetailList.forEach((item)=> {
      if (item.type === "rectangle") {
        let task = new Task(item.x, item.y, item.a, item.b, item.label, this.canvas, this);
        task.initAlgorithms();
        task.setDefaultAlgorithm();
        task.isReadyToRun = item.isReadyToRun;
        task.canRun = item.canRun;
        let inputDatas = [];
        let outputDatas = [];
        let parameters = [];
        item.selectedAlgorithm.inputDatas.forEach((inputItem)=>{
          let test = dataList.find(dataItem => dataItem.label === inputItem.label);
          inputDatas.push(test);
        });
        item.selectedAlgorithm.outputDatas.forEach((ouputItem)=>{
          outputDatas.push(dataList.find(dataItem => dataItem.label === ouputItem.label));
        });
        item.selectedAlgorithm.parameters.forEach((parameterItem)=>{
          let parameter = new Parameter(parameterItem.parametername);
          parameter.setValue(parameterItem.value);
          parameters.push(parameter);
          store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: parameterItem.parametername, value: parameterItem.value});
        });
        task.setInputDatas(inputDatas);
        task.setOutputDatas(outputDatas);
        task.setParameters(parameters);
        let nextTask = [];
        let preTask = [];
        item.nextTasks.forEach((nextTaskItem)=>{
          nextTask.push(taskList.find(taskItem => taskItem.label === nextTaskItem.label));
        });
        item.preTasks.forEach((preTaskItem)=>{
          preTask.push(taskList.find(taskItem => taskItem.label === preTaskItem.label));
        });
        if (nextTask.length > 0)
          task.addNextTask(...nextTask);
        if (preTask.length > 0)
          task.addPreTask(...preTask);
        taskList.push(task);
      }
    });
    // 最后完成连接
    dataList.push(...taskList);//将输入输出元素与任务元素合并
    modelDetailList.forEach((item)=> {
      if (item.type === "arrow") {
        let start = dataList.find(elementItem => elementItem.label === item.start.label);
        let end = dataList.find(elementItem => elementItem.label === item.end.label);
        let connection = new Connection(start, end, this.canvas);
        connection.isReady = item.isReady;
        connectionList.push(connection);
      }
    });
    dataList.push(...connectionList);
    this.list = dataList;
    this.reDraw(this.list);
  }

    //在这里修改输出变量的名字
  setOutputFileName(outputName, _data){
    let format;
    let nowtime = (new Date()).valueOf();
    let dataName;
    let filename;
    switch(_data.dataFormat[0]){
      case "Vector":
        format = '.shp';
        break;
      case "Raster":
        format = '.tif';
        break;
      case "Table":
        format = '.csv';
        break;
      case "Other":
        format = '';
        break;
    }
    dataName = _data.dataName.replace(/\s/g,"");
    filename = "result_egc/" +  dataName + nowtime + format;
    // switch (outputName){
    //   case "result samples":
    //     format = ".csv";
    //     dataName = _data.dataName.replace(/\s/g,"");
    //     filename = "result_egc/" +  dataName + nowtime + format;
    //     break;
    //   default:
    //     format = ".tif";
    //     dataName = _data.dataName.replace(/\s/g,"");
    //     filename = "result_egc/" +  dataName + nowtime + format;
    // }
    return filename;
  }
  async init(taskName){
    let elementList=[];  //用于存储模型的各类图形，如输入/输出数据(椭圆)，模型主体(矩形)，上下文关系(连接线)
    let predictingMethodInfo = {};
    this.reDraw(elementList); // clear the previous element
    if(taskName === ""){
      return 1;
    }
    if (this.canvas.getContext){
      let kb = new KnowledgeBase();
      let taskLocX = 300, taskLocY = 1800;
      let taskIconWidth = 100, taskIconHeight = 50;
      let dataIconWidth = 40, dataIconHeight = 25;
      let newTask = new Task(taskLocX,taskLocY,taskIconWidth,taskIconHeight,taskName,this.canvas,this);
      newTask.initAlgorithms();
      newTask.setDefaultAlgorithm();

      let algorithmName =  newTask.getSelectedAlgorithm().algorithmName;//获得当前模型的名字
      let inputNames = [];
      let inputDataFormat = [];
      let outputNames = [];
      let outputDataFormat = [];
      //返回模型图层结构
      await kb.findAlgorithmInterface(taskName,function (response) {
        let interfaces = response.data;
        interfaces.forEach(function (element) {
          if (element.input && !element.output){
            inputNames.push(element.name)
            inputDataFormat.push(element.inputDataFormat);
          }else if(!element.input && element.output){
            outputNames.push(element.name)
            outputDataFormat.push(element.inputDataFormat);
          }
        })
      })
      //返回具体模型的参数
      let parameters = [];
      await kb.findParameterNames(taskName,function (response) {
        let interfaces = response.data;
        interfaces.forEach(function (element) {
          let para = new Parameter(element.parameterName);
          // parameterNames.push(element.parameterName)
          if(element.parameterValue.length > 0){
            let value = element.parameterValue[0];
            let temp = [];
            temp.push(value);
            para.setValue(temp);
          }
          parameters.push(para);
        })
      })
      let inputDatas = [];
      let outputDatas = [];
      //let parameters = [];
      //生成输入数据图形
      let dataIconInverval = taskIconWidth / Math.floor(((inputNames.length + 1)/2));//输入间隔大小
      let allWidth = inputNames.length*(dataIconWidth*2+dataIconInverval) - dataIconInverval;
      let dataIconBeginLocX;
      if (inputNames.length === 1){
        dataIconBeginLocX = taskLocX;
      }else {
        dataIconBeginLocX =  taskLocX - allWidth/2 + dataIconWidth;
      }

      let dataIconBeginLocY = taskLocY - taskIconHeight*2;

      for(let i = 0;i<inputNames.length;i++){
        // let newData=new Data(100 + i*50,200,40,25,inputNames[i],this.canvas);
        let isCanDerive = await axios.get('./semantic/isCanDerive?semantic=' + inputNames[i]);//查询是否可派生
        //console.log(isCanDerive);
        let newData=new Data(dataIconBeginLocX + i*(dataIconInverval+dataIconWidth*2),dataIconBeginLocY,dataIconWidth,dataIconHeight,inputNames[i],isCanDerive.data.data,inputDataFormat[i],this.canvas);
        newData.hasValue = false;
        newData.setDefaultFillStyle('#e2a896');
        elementList.push(newData);
        inputDatas.push(newData);
      }
      //生成输出数据图形
      dataIconInverval = taskIconWidth / Math.floor(((outputNames.length + 1)/2));//输出间隔大小
      allWidth = outputNames.length*(dataIconWidth*2+dataIconInverval) - dataIconInverval;
      if (outputNames.length === 1){
        dataIconBeginLocX = taskLocX + 1;
      }else {
        dataIconBeginLocX =  taskLocX - allWidth/2 + dataIconWidth;
      }
      dataIconBeginLocY = taskLocY + taskIconHeight*2;
      for(let i =0;i< outputNames.length;i++){
        let _data;
        // if(outputNames[i]==="Uncertainty Map"){
        //   _data=new Data(500 + i*50,200,0,0,outputNames[i],this.canvas);
        // }else {
        //   _data=new Data(500 + i*50,200,40,25,outputNames[i],this.canvas);
        // }
        // _data=new Data(500 + i*50,200,40,25,outputNames[i],this.canvas);
        _data=new Data(dataIconBeginLocX + i*(dataIconInverval+dataIconWidth*2),dataIconBeginLocY,dataIconWidth,dataIconHeight,outputNames[i], 0, outputDataFormat[i], this.canvas);//初始结果必定不可派生
        let fileName = this.setOutputFileName(outputDatas[i], _data);
        let value = [];
        value.push(fileName);
        // _data.setValue(value);
        _data.setValueFromPreTask(value);
        _data.hasValue = true;
        _data.lastValue = true;
        elementList.push(_data);
        outputDatas.push(_data);
      }
      // for(let i = 0; i< parameterNames.length; i++){
      //
      //   let para = new Parameter(parameterNames[i]);
      //   parameters.push(para);
      //
      // }
      //设置模型的输入/输出、运行参数
      newTask.isReadyToRun = false;
      newTask.setInputDatas(inputDatas);
      newTask.setOutputDatas(outputDatas);
      //kb.setParametersDefaultValue(algorithmName,parameters);
      newTask.setParameters(parameters);

      elementList.push(newTask);
      //为输入数据与模型主体添加连接线
      for(let i=0; i< inputDatas.length;i++){
        let con = new Connection(inputDatas[i], newTask, this.canvas);
        con.isReady = false;
        elementList.push(con);

      }
      //为模型主体与输出数据添加连接线
      for(let i=0; i< outputDatas.length;i++){
        if(outputDatas[i].value[0]!=="Uncertainty Map"){
          let con = new Connection(newTask,outputDatas[i], this.canvas);
          con.isReady = false;
          elementList.push(con);
        }
      }
      predictingMethodInfo.inputData = inputDatas;
      predictingMethodInfo.outputData = outputDatas;
    }
    this.list = elementList;
    this.reDraw(elementList);//重画canvas
    return predictingMethodInfo;
  }

  //重画
  reDraw(elementList){
    //每当canvas高度或者宽度被重设时，画布内容就会被清空
    this.canvas.width = this.canvas.width;

    if (elementList.length ===0){
      return;
    }

    if (this.canvas.getContext){
      for(let i = elementList.length-1; i >= 0; i--){
        elementList[i].check();
        elementList[i].draw();
      }
      // elementList.forEach(function (item) {
      //   item.check();
      //   item.draw();
      // })
    }
  }

  onmousedown(e){
    this.current = null;
    this.currentLR = null;
    let flag = 0;
    let menuItemFlag = false;
    let coordinateT = new CoordinateT(e.clientX, e.clientY, this.canvas);
    let x = coordinateT.calculate().x;
    let y = coordinateT.calculate().y;
    for(let i = 0;i < this.list.length;i++){
      let c = this.list[i];
      if(flag === 1){
        c.fakemousedown(e);
      }else{
        c.onmousedown(e);
      }
      if(c.isCurrent === true){
        flag = 1;
        this.currentLR = c;
        if(e.button === 2){
          this.current = c;
        }
      }
    }
    if(this.currentPre !== null || this.currentLR !== null){
      this.reDraw(this.list);
    }
    this.currentPre = this.currentLR;

  }

  onmousemove(e){
    if(this.currentLR === null){
      return;
    }
    for(let i=0;i<this.list.length;i++){
      let c = this.list[i];
      c.onmousemove(e);
    }
    this.reDraw(this.list);
    // if(this.dataMenu!==null){
    //   this.dataMenu.onmousemove(e);
    //   this.dataMenu.draw();
    // }
    // if(this.taskMenu!==null){
    //   this.taskMenu.onmousemove(e);
    //   this.taskMenu.draw();
    // }
  }

  onmouseup(e){
    if(this.currentLR === null){
      return;
    }
    for(let i=0;i<this.list.length;i++){
      let c=this.list[i];
      c.onmouseup(e);
    }
    this.reDraw(this.list);
    this.currentLR = null;
  }

  // showcontextmenu(e){
  //   e.preventDefault();
  //   let x = e.clientX;
  //   let y = e.clientY;
  //   this.canvas.axios = {
  //     x, y
  //   };
  //   console.log("showcontextmenu");
  //
  // }

  addGraph(graph){

  }

  deleteMainTask(){
    //删除主任务
    this.list = [];//置空画板
    this.reDraw(this.list);
  }

  deleteTask(task){
    let inputDatas = task.getSelectedAlgorithm().inputDatas;
    let inputDataIndex = -1;
    //删除输入的元素
    for(let i = 0; i < inputDatas.length; i++){
      let result = this.checkDataHasFatherTask(inputDatas[i]);
      //删除输入元素，如果该元素被重复引用超过1次，则不删除，但需要删除连接线
      let otherRefCount = 0;
      for(let j = 0; j < this.list.length; j++){
        if(this.list[j].type ==='rectangle' && this.list[j] != task){
          if (this.list[j].getSelectedAlgorithm().inputDatas.indexOf(inputDatas[i]) !== -1){
            otherRefCount++;
          }
        }
      }
      if (result.flag && otherRefCount == 0){
        this.deleteTask(result.fatherTask);//递归删除只作为本任务的输入数据的父任务
      }
      // 如果没有其他的输入引用，则将该节点删除
      if (otherRefCount == 0){
        inputDataIndex = this.list.indexOf(inputDatas[i]);
        if (inputDataIndex !== -1){
          this.list.splice(inputDataIndex, 1);
        }
      }

      //删除由该任务产生的结果
      let outputDatas = task.getSelectedAlgorithm().outputDatas;
      for(let j = 0; j < outputDatas.length; j++){
        outputDatas[j].setValueFromPreTask([]);
      }

      //删除头为输入数据的连接线
      inputDataIndex = -1;
      for(let j = 0; j < this.list.length; j++){
        if(this.list[j].type ==='arrow' && this.list[j].start === inputDatas[i] && this.list[j].end === task){
          inputDataIndex = this.list.indexOf(this.list[j]);
          break;
        }
      }
      if (inputDataIndex !== -1){
        this.list.splice(inputDataIndex, 1);
      }
    }
    //删除由该任务产生的结果
    let outputDatas = task.getSelectedAlgorithm().outputDatas;
    for(let j = 0; j < outputDatas.length; j++){
      outputDatas[j].setValueFromPreTask([]);
    }
    //删除任务
    inputDataIndex = this.list.indexOf(task);
    this.list.splice(inputDataIndex, 1);
    //删除头为任务的连接线
    inputDataIndex = -1;
    for(let j = 0; j < this.list.length; j++) {
      if (this.list[j].type === 'arrow' && this.list[j].start === task) {
        inputDataIndex = this.list.indexOf(this.list[j]);
        break;
      }
    }
    if (inputDataIndex !== -1){
      this.list.splice(inputDataIndex, 1);
    }
  }

  //可弃用，换为deleteTask，add by yrx 20200827
  deleteGraph(graph){
    let tmp = [];
    let flag = 1;
    let last_task = null;
    //找到最后一个任务
    for(let i =0; i< this.list.length; i++){
      if(this.list[i].type ==="rectangle"){
        if(this.list[i].nextTasks.length ===0){
          last_task = this.list[i];
        }
      }
    }

    if(graph.type ==="rectangle"){
      if(graph === last_task){
        for(let i = 0; i< this.list.length; i++){
          if(this.list[i].type ==='ellipse'){
            if(!graph.hasOutputData(this.list[i])){
              tmp.push(this.list[i]);
            }
          }else if(this.list[i].type ==='rectangle' && this.list[i] !== graph){
            if(this.list[i].taskIsNextTask(graph))
            {
              this.list[i].deleteNextTask(graph);
            }
            tmp.push(this.list[i]);
          }else if(this.list[i].type ==='arrow'){
            if(this.list[i].start !== graph && this.list[i].end !== graph){
              tmp.push(this.list[i]);
            }
          }
        }
      }else {
        for(let i = 0; i< this.list.length; i++){

          if(this.list[i].type ==='ellipse'){
            if(graph.hasOutputData(this.list[i])){
              let value = [];
              this.list[i].setValue(value);
            }
            tmp.push(this.list[i]);
          }else if(this.list[i].type ==='rectangle' && this.list[i] !== graph){
            if(this.list[i].taskIsNextTask(graph)) {
              this.list[i].deleteNextTask(graph);
            }
            tmp.push(this.list[i]);
          }else if(this.list[i].type ==='arrow'){
            if(this.list[i].start !== graph && this.list[i].end !== graph){
              tmp.push(this.list[i]);
            }
          }
        }
      }
      this.list = tmp;
    }

    while(flag ===1){
      flag = 0;
      let invalid_data = null;
      let invalid_task = null;
      for(let i =0; i< this.list.length; i++){
        if(this.list[i].type ==='ellipse' && !last_task.hasOutputData(this.list[i])){
          let tag = 0;
          for(let j =0; j< this.list.length; j++){
            if(this.list[j].type ==='arrow' && this.list[j].start ===this.list[i]){
              tag = 1;
              break;
            }
          }
          if(tag ===0){
            invalid_data = this.list[i];
            flag = 1;
            break;
          }
        }else if(this.list[i].type ==='rectangle' && this.list[i] !== last_task){
          let tag = 0;
          for(let j =0; j< this.list.length; j++){
            if(this.list[j].type ==='arrow' && this.list[j].start ===this.list[i]){
              tag = 1;
              break;
            }
          }
          if(tag ===0){
            invalid_task = this.list[i];
            flag = 1;
            break;
          }
        }
      }// end of for
      if(invalid_data !== null){

        let temp =[];
        for(let i = 0; i < this.list.length; i ++){
          if(this.list[i].type === 'rectangle'){
            temp.push(this.list[i]);
          }else if(this.list[i].type === 'ellipse' ){
            if(this.list[i]!== invalid_data){
              temp.push(this.list[i]);
            }
          }else if(this.list[i].type === 'arrow'){
            if(this.list[i].end !== invalid_data){
              temp.push(this.list[i]);
            }
          }
        }
        this.list = temp;
      }else if(invalid_task !== null){

        let temp =[];
        for(let i = 0; i< this.list.length; i ++){
          if(this.list[i].type === 'ellipse'){
            temp.push(this.list[i]);
          }else if(this.list[i].type === 'rectangle' ){
            if(this.list[i]!== invalid_task){
              if(this.list[i].taskIsNextTask(invalid_task))
              {
                this.list[i].deleteNextTask(invalid_task);
              }
              temp.push(this.list[i]);
            }
          }else if(this.list[i].type === 'arrow'){
            if(this.list[i].end !== invalid_task){
              temp.push(this.list[i]);
            }
          }
        }
        this.list = temp;
      }
    }
  }

  getCurrent(){
    return this.currentLR;
  }
  findEnvsEclipse(){
    let envData = null;
    for (let i =0; i< this.list.length; i++){
      if (this.list[i].type===modelingConst.ELLIPSE){
        if (this.list[i].dataName === modelingConst.SOILENVIRONMENT){
          envData = this.list[i];
        }
      }
    }
    return envData;
  }
  writeEnvsValues(){
    let envData = this.findEnvsEclipse();
    let dataValues = "";
    for (let i=0; i < this.list.length; i++){
      if(this.list[i].type === modelingConst.RECTANGLE){
        let datasInPredictingAlgorithm = this.list[i].getSelectedAlgorithm().inputDatas;
        if (datasInPredictingAlgorithm.indexOf(envData) >= 0){
          for (let j = 0; j < datasInPredictingAlgorithm.length; j++){
            if (datasInPredictingAlgorithm[j].dataName !== modelingConst.SOILENVIRONMENT && datasInPredictingAlgorithm[j].dataName!==modelingConst.MODELINGSAMPLES){
              if (datasInPredictingAlgorithm[j].value.length > 0){
                if (dataValues === ""){
                  dataValues = dataValues + datasInPredictingAlgorithm[j].value[0];
                }else {
                  dataValues = dataValues + modelingConst.PATHSPLIT + datasInPredictingAlgorithm[j].value[0];
                }
              }
            }
          }
        }
      }
    }
    if (dataValues !== ""){
      let value = [];
      value.push(dataValues);
      envData.setValue(value);
    }
    this.reDraw(this.list);
  }
  checkEnvs(){
    let datasInPredictingAlgorithm = [];
    let envNames = [];
    for (let i=0; i < this.list.length; i++) {
      if (this.list[i].type === modelingConst.RECTANGLE && this.list[i].taskName === modelingConst.COVARIATESETTING) {
        datasInPredictingAlgorithm = this.list[i].getSelectedAlgorithm().inputDatas;
        break;
      }
    }
    for (let j = 0; j < datasInPredictingAlgorithm.length; j++) {
      envNames.push(datasInPredictingAlgorithm[j].dataName);
    }
    return envNames;
  }

  checkHasSoilSample(){
    for (let i=0; i < this.list.length; i++) {
      if (this.list[i].type === modelingConst.ELLIPSE && this.list[i].dataName === modelingConst.MODELINGSAMPLES) {
        return true;
      }
    }
    return false;
  }

  checkHasCovariateSetting(){
    for (let i=0; i < this.list.length; i++) {
      if (this.list[i].type === modelingConst.RECTANGLE && this.list[i].taskName === modelingConst.COVARIATESETTING) {
        return true;
      }
    }
    return false;
  }

  setCovariatesDataType(rasterDataTypeList){
    for (let i=0; i < this.list.length; i++) {
      // 如果任务的输入因子是Covariates，则需要添加环境协变量数据类型
      if (this.list[i].type === modelingConst.RECTANGLE) {
        let datasInAlgorithm = this.list[i].getSelectedAlgorithm().inputDatas;
        if(datasInAlgorithm.find(inputDataItem => inputDataItem.dataName === modelingConst.SOILENVIRONMENT)){
          this.list[i].setParameter(modelingConst.ENVRULES, rasterDataTypeList);
        }
      }
    }
  }

  setSoilSampleProperty(soilProperty){
    for (let i=0; i < this.list.length; i++) {
      // 如果任务的输入因子是Covariates，则需要添加环境协变量数据类型
      if (this.list[i].type === modelingConst.RECTANGLE) {
        let datasInAlgorithm = this.list[i].getSelectedAlgorithm().inputDatas;
        if(datasInAlgorithm.find(inputDataItem => inputDataItem.dataName === modelingConst.MODELINGSAMPLES)){
          this.list[i].setParameter(modelingConst.SOILPROPERTYFIELD, soilProperty);
        }
      }
    }
  }

  checkDataHasFatherTask(data){
    let result = {flag: false, fatherTask: null};
    for (let i=0; i < this.list.length; i++){
      if(this.list[i].type === modelingConst.RECTANGLE){
        let datasInAlgorithm = this.list[i].getSelectedAlgorithm().outputDatas;
        if (datasInAlgorithm.indexOf(data) >= 0){
          result.flag = true;
          result.fatherTask = this.list[i];
        }
      }
    }
    return result;
  }
  checkInputDataTask(data){
    let result = {flag: false, inputTask: null};
    for (let i=0; i < this.list.length; i++){
      if(this.list[i].type === modelingConst.RECTANGLE){
        let datasInAlgorithm = this.list[i].getSelectedAlgorithm().inputDatas;
        if (datasInAlgorithm.indexOf(data) >= 0){
          result.flag = true;
          result.inputTask = this.list[i];
        }
      }
    }
    return result;
  }

}
