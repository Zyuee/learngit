/**
 * Created by lp on 2017/6/16.
 */

import MenuItem from './MenuItem';
import {taskMenuItemDelete,taskMenuItemRun,taskMenuItemParameters,
  taskMenuItemEnvSelecting} from '../constantName';

export default class TaskMenuItem extends MenuItem{
  constructor(graphManager,canvas,x,y,graph,text){
    super(graphManager,canvas,x,y,graph,text);
  }
  click() {
    if (this.text === taskMenuItemDelete) {
      this.graphManager.deleteGraph(this.graph);
      this.graphManager.reDraw();
    } else if (this.text === taskMenuItemParameters) {
      let paras = this.graph.getParameters();
      if (paras.length === 0) {
        return 0;
      } else {
        //todo:弹出设置参数窗体
      }
    } else if (this.text === taskMenuItemRun) {
      //TODO:设计运行进度条
      this.graphManager.generateBPEL();
      this.graphManager.topologySort();
    }else if (this.text === taskMenuItemEnvSelecting){

    }
    this.canvas.onmouseup();
  }
}
