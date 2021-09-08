/**
 * Created by lp on 2017/6/20.
 */

import $ from 'jquery';
export default class Knowledge {
  constructor(){
    this.GeoTask_XMLDoc = null;
  }

//可以把taskXMLParse和loadTaskXML放到canvas界面，这样子不用每次新建KnowLedge都重新
  taskXMLParse(xmlStr){
    if(!window.DOMParser && window.ActiveXObject){
      var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
      for(var i=0;i<xmlDomVersions.length;i++){
        try{
          this.GeoTask_XMLDoc = new ActiveXObject(xmlDomVersions[i]);
          this.GeoTask_XMLDoc.async = false;
          this.GeoTask_XMLDoc.loadXML(xmlStr);
          break;
        }catch(e){
        }
      }
    }else if(window.DOMParser && document.implementation && document.implementation.createDocument){
      var domParser = new  DOMParser();
      this.GeoTask_XMLDoc = domParser.parseFromString(xmlStr, 'text/xml');
    }
  }

  loadTaskXML(){
    $.ajax({
      url:"task.xml",
      dataType: 'xml',
      type:'GET',
      error:function (xml) {
        alert("load file error");
      },
      success:function (xml) {
        this.taskXMLParse(xml);
      }
    });
  }
  static getFirstchild(n){
    let x = n.firstChild;
    while (x.nodeType!=1)
    {
      x=x.nextSibling;
    }
    return x;
  }

  findAlgorithmNames(taskName){
    let algorithmNames = [];
    var taskNode = this.GeoTask_XMLDoc.getElementById(taskName);
    var algorithmsNode = this.getFirstchild(taskNode);
    var algorithmNodes = algorithmsNode.childNodes;
    for(var i =0; i< algorithmNodes.length; i++){
      if(algorithmNodes[i].nodeName ==="Algorithm"){
        var name = this.getFirstchild(algorithmNodes[i]).childNodes[0].nodeValue;
        algorithmNames.push(name);
      }
    }
  }


  findInputDataNames(algorithmName){
    var dataNames = [];
    var inputsNode = this.GeoTask_XMLDoc.getElementById("In_" + algorithmName);
    var inputNodes = inputsNode.childNodes;
    for(var i =0; i<inputNodes.length; i++){
      if(inputNodes[i].nodeName === "Input"){
        var name = this.getFirstchild(inputNodes[i]).childNodes[0].nodeValue;
        dataNames.push(name);
      }
    }
    return dataNames;
  }

  findParameterNames(algorithmName){
    var parameterNames = [];
    var parametersNode = this.GeoTask_XMLDoc.getElementById("Para_" + algorithmName);
    var parameterNodes = parametersNode.childNodes;
    for(var i =0;i<parameterNodes.length; i++){
      if(parameterNodes[i].nodeName === "Parameter"){
        var name = this.getFirstchild(parameterNodes[i]).childNodes[0].nodeValue;
        parameterNames.push(name);
      }
    }
    return  parameterNames;
  }

  setParametersDefaultValue(algorithmName,parameters){
    var parametersNode = this.GeoTask_XMLDoc.getElementById("Para_" + algorithmName);
    var parameterNodes = parametersNode.childNodes;
    for(var i =0;i<parameterNodes.length; i++){
      if(parameterNodes[i].nodeName === "Parameter"){
        var paraName = null;
        var defaultValue = null;
        var nodes = parameterNodes[i].childNodes;
        for(var j=0;j<nodes.length;j++){
          if(nodes[j].nodeName === "ParaSematic"){
            paraName = nodes[j].childNodes[0].nodeValue;
          }else if(nodes[j].nodeName === "DefaultValue"){
            if(nodes[j].childNodes.length===0){
              defaultValue = "";
            }else{
              defaultValue = nodes[j].childNodes[0].nodeValue;
            }
          }
        }
        for(var k =0;k<parameters.length; k++){
          if(parameters[k].parametername === paraName){
            var value = [];
            value.push(defaultValue);
            parameters[k].setValue(value);
          }
        }
      }
    }
  }

  findOutputDataNames(algorithmName){
    var dataNames = [];
    var algorithmNode = this.GeoTask_XMLDoc.getElementById(algorithmName);

    var taskNode = algorithmNode.parentNode.parentNode;
    var taskID = taskNode.getAttribute("id");
    var outputsNode = this.GeoTask_XMLDoc.getElementById("Out_" + taskID);
    var outputNodes = outputsNode.childNodes;
    for(var i =0;i<outputNodes.length; i++){
      if(outputNodes[i].nodeName === "Output"){
        var name = this.getFirstchild(outputNodes[i]).childNodes[0].nodeValue;
        dataNames.push(name);
      }
    }
    return dataNames;
  }

  findTaskNameHasOutput(outputname){
    var outputNode = this.GeoTask_XMLDoc.getElementById(outputname);
    var taskNode = outputNode.parentNode.parentNode;
    var taskName = taskNode.getAttribute("TaskName");
    return taskName;
  }

}
