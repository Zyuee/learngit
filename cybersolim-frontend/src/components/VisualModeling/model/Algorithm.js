/**
 * Created by lp on 2017/6/16.
 */

/**
 *
 * 算法类
 * @method Algorithm
 *
 * */
export default class Algorithm{
  constructor(algorithmName){
    this.algorithmName = algorithmName;
    this.inputDatas = [];
    this.outputDatas = [];
    this.parameters = [];
  }
//========================输入数据===========================
  hasInputData(inputData){
    for(let i = 0;i < this.inputDatas.length;i++){
      if(inputData === this.inputDatas[i]){
        return true;
      }
    }
    return false;
  }

  setInputDatas(Datas){
    this.inputDatas = [];
    for(let i =0;i<Datas.length;i++){
      this.inputDatas.push(Datas[i]);
    }
  }
  getInputDatas(){
    return this.inputDatas;
  }
  addInputData(inputData){
    this.inputDatas.push(inputData);
  }

  deleteInputData(inputData){
    let tmp = [];
    for(let i = 0;i<this.inputDatas.length; i++){
      if(inputData!==this.inputDatas[i])
        tmp.push(this.inputDatas[i]);
    }
    this.inputDatas = tmp;
  }

  clearInputDatas(){
    this.inputDatas = [];
  }
//========================输出数据===========================
  hasOutputData(outData){
    for(let i =0;i<this.outputDatas.length;i++){
      if(outData === this.outputDatas[i]){
        return true;
      }
    }
    return false;
  }
  setOutputDatas(outDatas){
    this.outputDatas = outDatas;
  }
  getOutputDatas(){
    return this.outputDatas;
  }
  addOutputData(outData){
    this.outputDatas.push(outData);
  }

  deleteOutputData(){}

  clearOutputDatas(){
    this.outputDatas = [];
  }
//========================算法参数===========================
  hasParameter(para){
    for(let i = 0; i < this.parameters.length;i++){
      if(para === this.parameters[i])
        return true;
    }
    return false;
  }
  addParameter(para){
    this.parameters.push(para);
  }
  setParameters(paras){
    this.parameters = [];
    for(let i = 0; i< paras.length; i++){
      this.parameters.push(paras[i]);
    }
  }
  getParameters(){
    return this.parameters;
  }
  deleteParameter(para){
    let tmp = [];
    for(let i=0;i<this.parameters.length;i++){
      if(para!==this.parameters[i])
        tmp.push(this.parameters[i]);
    }
    this.parameters = tmp;
  }

  clearParameters(){
    this.parameters = [];
  }

}
