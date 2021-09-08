/**
 * Created by lp on 2017/6/16.
 */
import MenuItem from './MenuItem';
import KnowledgeBase from '../../knowledge/Knowledge_new';
import Task from '../model/Task';
import Data from '../model/Data';
import Parameter from '../model/Parameter';
import Connection from '../model/Connection';
import { vIziToast } from '@/js/notify/v-iziToast'
/**
 *
 * 左键单击menu事件处理类
 * @class DataMenuItem
 *
 * */
export default class DataMenuItem extends MenuItem{
  constructor(graphManager,canvas,x,y,graph,text){
    super(graphManager,canvas,x,y,graph,text);

  }
   click(){

    this.clickEvent().then(function () {
      console.log("Click data menu successfully")
    });
    //this.canvas.onmouseup();
  }

  async clickEvent(){
    if(this.text ==='Automate'){
      let kb = new KnowledgeBase();
      vIziToast.holdOn("searching algorithm, please hold on");
      console.log("holdOn");
      //let taskname = kb.findTaskNameHasOutput(this.graph.dataName);
      let taskName = null;
      let inputNames = [];
      let outputNames = [];
      let parameterNames = [];
      //todo: 现在只是实现一个输出数据对应一个算法，以后需要改为可能有多个算法对应一个输出数据，可以选择
      await kb.findTaskNameHasOutput(this.graph.dataName,function (response) {
        let tasks = response.data;
        tasks.forEach(function (task) {
          taskName = task.algorithmName;
          let interfaces = task.algorithmInterfaceList;
          parameterNames = task.algorithmParameterList;
          interfaces.forEach(function (algorithmInterface) {
            if (algorithmInterface.input && !algorithmInterface.output){
              inputNames.push(algorithmInterface.name)
            }else if(!algorithmInterface.input && algorithmInterface.output){
              outputNames.push(algorithmInterface.name)
            }
          })
        })
      })

      if(taskName===null)
        return;
      var toast = document.querySelector('.iziToast');
      vIziToast.hide(toast);
      let x_task = this.graph.x + 150;
      let y_task = this.graph.y - 70;
      let newTask = new Task(x_task,y_task,100,50,taskName,this.canvas,this.graphManager);
      this.graphManager.list.push(newTask);
      newTask.initAlgorithms();
      newTask.setDefaultAlgorithm();
      let  algorithmName =  newTask.getSelectedAlgorithm().algorithmName;
      let inputDatas = [];
      let paras = [];
      let counter = 0;
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
          let x_data = this.graph.x + 350;
          let y_data = this.graph.y - 100;
          let newData=new Data(x_data + counter * 50, y_data,40, 25, inputNames[i], this.canvas);
          this.graphManager.list.push(newData);
          inputDatas.push(newData);
          counter ++;
        }
      }
      for(let i = 0;i<this.graphManager.list.length;i++){
        if(this.graphManager.list[i].type === 'rectangle'){
          if(this.graphManager.list[i].hasInputData(this.graph))
          {
            newTask.addNextTask(this.graphManager.list[i]);
          }
        }
      }
      for(let i = 0; i < parameterNames.length; i++){
        let para = new Parameter(parameterNames[i].parameterName);
        paras.push(para);
      }
      let outputDatas = []
      let value = []
      let nowtime = (new Date()).valueOf()
      let filename = null
      //todo: 不同的数据可能具有不同的格式
      filename = 'result_egc/' + this.graph.dataName + nowtime + '.tif'

      filename = filename.replace(/\s/g,"");
      value.push(filename);
      this.graph.setValue(value);
      outputDatas.push(this.graph);
      //// begin of Sample Based Mapping
      let currentTask = null;
      for(let i =0; i<this.graphManager.list.length; i++){
        if(this.graphManager.list[i].type==='rectangle'&&this.graphManager.list[i].hasInputData(this.graph)){
          currentTask = this.graphManager.list[i];
          break;
        }
      }
      //todo:判断是否为推测算法
      let algorithm = currentTask.selectedAlgorithm
      let inputDatas = algorithm.inputDatas
      let temps = []
      let Env_Layers_Management = null
      let layerDataNames = ''
      for (let i = 0; i < inputDatas.length; i++) {
        if (inputDatas[i].dataName === 'Env.Layers ManageMent') {
          Env_Layers_Management = inputDatas[i]
        }
        if (inputDatas[i].dataName !== 'Sample Data' && inputDatas[i].dataName !== 'Env.Layers ManageMent') {
          temps.push(inputDatas[i])
        }
      }
      if (temps.length === 1) {
        layerDataNames = temps[0].value[0]
      } else if (temps.length > 1) {
        for (let i = 0; i < temps.length; i++) {
          if (i === 0) {
            layerDataNames = layerDataNames + temps[i].value[0]
          } else {
            layerDataNames = layerDataNames + '#' + temps[i].value[0]
          }
        }
      }
      let value = []
      value.push(layerDataNames)
      Env_Layers_Management.setValue(value)

      //// end of  Sample Based Mapping
      newTask.setInputDatas(inputDatas);
      newTask.setOutputDatas(outputDatas);
      kb.setParametersDefaultValue(algorithmName,paras);
      newTask.setParameters(paras);

      let con = new Connection(newTask,this.graph, this.canvas);
      this.graphManager.list.push(con);

      for(let i=0;i<inputDatas.length;i++){
        let con = new Connection(inputDatas[i],newTask, this.canvas);
        this.graphManager.list.push(con);
      }
      this.graphManager._dataMenu = null;
      this.graphManager.reDraw();

    }
  }
}
