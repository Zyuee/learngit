/**
 * Created by lp on 2017/6/16.
 */
import Menu from './Menu';
import DataMenuItem from './DataMenuItem';
import CoordinateT from '../model/CoordinateT';
export default class DataMenu extends Menu{
  constructor(graphManager,canvas,e,graph,text){
    super(graphManager,canvas,e,graph,text);
  }
  init(){
    let coordinateT = new CoordinateT(this.e.clientX, this.e.clientY, this.canvas);
    let x = coordinateT.calculate().x;
    let y = coordinateT.calculate().y;

    if(this.graph.lastValue === false){
      if(this.graph.dataName === 'Env.Layers ManageMent'){
        let item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove Env.Layers");
        this.list.push(item1);
      }else if(this.graph.dataName === 'Sample Data'){
        let item1 = new DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SetSampleData");
        this.list.push(item1);
      }else if(this.graph.dataName ==="HM Env.Layers ManageMent"){
        let item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove HMEnv.Layers");
        this.list.push(item1);
      }else if(this.graph.dataName ==="FS Env.Layers ManageMent"){
        let item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Add/Remove FSEnv.Layers");
        this.list.push(item1);
      }else if(this.graph.interMediateResult === true)
      {
        //var item1 = new DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"download");
        //this.list.push(item1);
      }else{
        let item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"Automate");
        this.list.push(item1);

        let item2 = new  DataMenuItem(this.graphManager,this.canvas,x,y + 31,this.graph,"SetData");
        this.list.push(item2);
        //TODO:add  download button
        //var item3 = new  DataMenuItem(this.graphManager,this.canvas,x,y+62,this.graph,"download");
        //this.list.push(item3);
      }
    }else {
      //var item1 = new  DataMenuItem(this.graphManager,this.canvas,x,y,this.graph,"SetOutput");
      //this.list.push(item1);
    }
  }
}
