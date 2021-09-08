/**
 * Created by lp on 2017/6/16.
 */

/**
 *
 * 任务菜单和数据菜单的基类
 * @class Menu
 *
 * */
export default class Menu{
  constructor(graphManager,canvas,e,graph,text){
    this.graphManager = graphManager;
    this.canvas = canvas;
    this.graph = graph;
    this.e = e;
    this.text = text;
    this.list = [];
    this.current = null;
  }

  isPointIn(x,y){
    for(let i =0 ;i < this.list.length; i++){
      if(this.list[i].isPointIn(x,y)){
        this.current = this.list[i];
        return true;
      }
    }
    return false;
  }

  click(){
    this.current.click();
  }
  onmousemove(e){
    for(let i =0;i<this.list.length;i++){
      this.list[i].onmousemove(e);
    }
  }
  draw(){
    for(let i = 0;i<this.list.length;i++){
      this.list[i].draw();
    }
  }

  init(){}

}
