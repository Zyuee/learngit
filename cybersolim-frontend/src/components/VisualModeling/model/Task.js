/**
 * Created by lp on 2017/6/16.
 */

import Rectangle from '../geometry/Rectangle';
import Algorithm from './Algorithm';
import knowledgeBase from '../../knowledge/Knowledge';
import Parameter from '../model/Parameter'


/**
 *
 * 任务类，继承Rectangle
 * @class Task
 *
 * */
export default class Task extends Rectangle{
  constructor(x,y,width,height,label,canvas,graphManager){
    super(x,y,width,height,label,canvas);
    this.taskName = this.label;
    this.graphManager = graphManager;
    this.selectedAlgorithm = null;
    this.algorithms = [];
    this.nextTasks = [];
    this.preTasks = [];
  }

  hasInputData(inputData){
    return this.selectedAlgorithm.hasInputData(inputData);
  }

  hasOutputData(outData){
    return this.selectedAlgorithm.hasOutputData(outData);
  }

  initAlgorithms(){
    // let kb = new knowledgeBase();
    // let algorithmNames = kb.findAlgorithmNames(this.taskName);
    // for(let i = 0;i < algorithmNames.length; i++){
    //   let ag = new Algorithm(algorithmNames[i]);
    //   this.algorithms.push(ag);
    // }
    let ag = new Algorithm(this.taskName)
    this.algorithms.push(ag);
  }

  setAlgorithm(algorithmName){
    for(let i = 0 ;i < this.algorithms.length;i++){
      if(this.algorithms[i].algorithmName === algorithmName){
        this.selectedAlgorithm = this.algorithms[i];
      }
    }
  }

  //这个函数可以删除，因为setAlgorithm可以直接复制selectedAlgorithm
  //直接调用new Task.selectedAlgorithm即可
  getSelectedAlgorithm(){
    return this.selectedAlgorithm;
  }

  /**
   *
   * 设置每个任务默认的算法
   * @method setDefaultAlgorithm
   *
   * */
  setDefaultAlgorithm(){
    if(this.algorithms.length >= 1){
      this.selectedAlgorithm = this.algorithms[0];
    }
  }

  setParameters(paras){
    if(this.selectedAlgorithm!==null){
      this.selectedAlgorithm.parameters = paras;
    }
  }

  setParameter(paranmeterName, parameterValue){
    let result = this.selectedAlgorithm.parameters.find(paramItem => paramItem.parametername === paranmeterName);
    if (result != undefined || result != null){
      //如果有值，则修改当前值
      result.value = parameterValue;
    }else {
      //如果当前没有这个参数，则新建并添加
      let parameter = new Parameter(paranmeterName);
      parameter.setValue(parameterValue);
      this.selectedAlgorithm.parameters.push(parameter);
    }

  }

  getParameters(){
    if(this.selectedAlgorithm!==null){
      return this.selectedAlgorithm.parameters;
    }
  }

  setInputDatas(inputDatas){
    if(this.selectedAlgorithm!==null){
      this.selectedAlgorithm.inputDatas = inputDatas;
    }
  }

  getInpuDatas(){
    if(this.selectedAlgorithm!==null){
      return this.selectedAlgorithm.inputDatas;
    }
    return null;
  }

  setOutputDatas(outputDatas){
    if(this.selectedAlgorithm!==null){
      this.selectedAlgorithm.outputDatas = outputDatas;
    }
  }

  getOutputDatas(){
    if(this.selectedAlgorithm!==null){
      return this.selectedAlgorithm.outputDatas;
    }
    return null;
  }

  //todo:查验这个函数是否正确
  taskIsNextTask(nexttask){
    for(let i =0;i<this.nextTasks.length;i++){
      if(nexttask === this.nextTasks[i])
        return true;
    }
    return false;
  }

  addNextTask(nexttask){
    this.nextTasks.push(nexttask);
  }

  deleteNextTask(nexttask){
    let temp = [];
    for(let i=0;i<this.nextTasks.length;i++){
      if(this.nextTasks[i]!==nexttask){
        temp.push(this.nextTasks[i]);
      }
    }
    this.nextTasks = temp;
  }

  addPreTask(pretask){
    this.preTasks.push(pretask);
  }

  setPreTasks(pretasks){
    this.preTasks = [];
    for(let i = 0; i<pretasks.length;i++){
      this.preTasks.push(this.nextTasks[i]);
    }
  }

  run(){

  }
  /**
   *
   * to check if input data and output data both have values
   * @method check
   *
   * */
  //
  check(){
    this.isReadyToRun = true;
    this.canRun = true;
    let inputDatas = this.selectedAlgorithm.inputDatas;
    let outputDatas = this.selectedAlgorithm.outputDatas;
    //检查是否所有的输入输入都填入了数据
    for(let i = 0;i< inputDatas.length; i++ ){
      if(inputDatas[i].value.length === 0 && inputDatas[i].valueFromPreTask.length === 0){
        this.isReadyToRun = false;
      }
    }
    //如果都填入了数据，则设置输出的结果名字
    if(this.isReadyToRun){
      for(let i = 0;i <outputDatas.length;i++ ){
        let suffix = '';
        switch(outputDatas[i].dataFormat[0]){
          case "Vector":
            suffix = '.shp';
            break;
          case "Raster":
            suffix = '.tif';
            break;
          case "Table":
            suffix = '.csv';
            break;
          case "Other":
            suffix = '';
            break;
        }
        let value = [];
        let nowtime = (new Date()).valueOf();
        //如果能找到用户的ID更加好
        let filename = "result_egc/" + outputDatas[i].dataName + nowtime + suffix;
        filename = filename.replace(/\s/g,"");
        value.push(filename);
        outputDatas[i].setValueFromPreTask(value);
      }
    }
    // for(let i = 0;i <outputDatas.length;i++ ){
    //   if(outputDatas[i].valueFromPreTask.length === 0){
    //     this.isReadyToRun = false;
    //   }
    // }
    // //不断回调判断list中任务是否都可以运行。感觉这里很别扭
    // if(this.isReadyToRun === true){
    //   if(this.nextTasks.length===0){
    //     var bag = true;
    //     for(let i = 0;i< this.graphManager.list.length; i++){
    //       if(this.graphManager.list[i].type ==="rectangle" && this.graphManager.list[i]!== this){
    //         this.graphManager.list[i].check();
    //         if(!this.graphManager.list[i].isReadyToRun){
    //           bag = false;
    //           break;
    //         }
    //       }
    //     }
    //     this.canRun = bag;
    //   }else {
    //     this.canRun = false;
    //   }
    // }
  }



}
