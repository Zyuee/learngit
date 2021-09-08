/**
 * Created by lp on 2017/6/20.
 * 用于获取后台模型信息的对象，add by yrx on 2020/7/23
 */

import axios from 'axios';

export default class knowledge {

  constructor () {
    //this.data = null
  }

  /**
   * 用于在后台查找某模型的结果参数
   * @param algorithmName
   * @param callback
   * @returns {Promise<AxiosResponse<any>>}
   */
  findAlgorithmInterface (algorithmName, callback) {
    return axios({
      method: 'GET',
      url: './algorithm/findInterface',
      params: {serviceName: algorithmName}
    }).then((response) => {
      // let data = response.data
      // console.log(data)
      // return data
      //console.log("a");
      //console.log(response.data);
      callback(response.data)
    })
  }

  findParameterNames (algorithmName, callback) {
    return axios({
      method: 'GET',
      url: './algorithm/findAlgorithmParameter',
      params: {serviceName: algorithmName}
    }).then((response) => {
      callback(response.data)
    })
  }


  setParametersDefaultValue (algorithmName, parameters) {

  }

  findTaskNameHasOutput (outputName, callback) {
    return axios({
      method: 'GET',
      url: './algorithm/findAlgorithmByOutputName',
      params: {outputName}
    }).then((response) => {callback(response.data)})
  }


  judgeHasEnvs (outputName, callback) {
    return axios({
      method: 'GET',
      url: './algorithm/judgeHasEnvs',
      params: {outputName}
    }).then((response) => {callback(response.data)})
  }

  initAlgorithms () {
    return taskName
  }
}
