/**
 * Created by lp on 2017/6/16.
 */

import Menu from './Menu';
import TaskMenuItem from './TaskMenuItem';
import CoordinateT from '../model/CoordinateT';
import knowledge from '../../knowledge/knowledge_new';
import {taskMenuItemDelete,taskMenuItemRun,taskMenuItemParameters,
  taskMenuItemEnvSelecting} from '../constantName';

export default class TaskMenu extends Menu{
  constructor(graphManager,canvas,e,graph,text){
    super(graphManager,canvas,e,graph,text);
  }
  async init(){
    let coordinateT = new CoordinateT(this.e.clientX, this.e.clientY, this.canvas);
    let x = coordinateT.calculate().x;
    let y = coordinateT.calculate().y;
    let params = [];
    let kb = new knowledge();
    let hasEnvs = false;
    //查找指定算法的参数
    await kb.findParameterNames(this.graph.taskName, function (response) {
      params = response.data;
    })
    await kb.judgeHasEnvs(this.graph.taskName, function (response) {
      hasEnvs = response.data;
    })
    if(this.graph.isReadyToRun && this.graph.canRun){
      if (params.size > 0 && hasEnvs === true){
        let item0 = new  TaskMenuItem(this.graphManager,this.canvas,x, y, this.graph, taskMenuItemRun);
        this.list.push(item0);
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,taskMenuItemParameters);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 61,this.graph,taskMenuItemEnvSelecting);
        this.list.push(item2);
        let item3 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item3);
      }else if (params.size <= 0 && hasEnvs === true){
        let item0 = new  TaskMenuItem(this.graphManager,this.canvas,x, y, this.graph, taskMenuItemRun);
        this.list.push(item0);
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 61,this.graph,taskMenuItemEnvSelecting);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item2);
      }else if (params.size > 0 && hasEnvs === false){
        let item0 = new  TaskMenuItem(this.graphManager,this.canvas,x, y, this.graph, taskMenuItemRun);
        this.list.push(item0);
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,taskMenuItemParameters);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item2);
      }else if (params.size <= 0 && hasEnvs === false){
        let item0 = new  TaskMenuItem(this.graphManager,this.canvas,x, y, this.graph, taskMenuItemRun);
        this.list.push(item0);
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item1);
      }

    }else{
      if (params.size > 0 && hasEnvs === true){
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,taskMenuItemParameters);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 61,this.graph,taskMenuItemEnvSelecting);
        this.list.push(item2);
        let item3 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item3);
      }else if (params.size <= 0 && hasEnvs === true){
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 61,this.graph,taskMenuItemEnvSelecting);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item2);
      }else if (params.size > 0 && hasEnvs === false){
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,taskMenuItemParameters);
        this.list.push(item1);
        let item2 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item2);
      }else if (params.size <= 0 && hasEnvs === false){
        let item1 = new  TaskMenuItem(this.graphManager,this.canvas,x,y + 91,this.graph,taskMenuItemDelete);
        this.list.push(item1);
      }
    }
  }
}
