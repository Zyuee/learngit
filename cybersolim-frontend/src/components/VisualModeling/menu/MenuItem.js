/**
 * Created by lp on 2017/6/16.
 */
import CoordinateT from '../model/CoordinateT';
export default class MenuItem{
  constructor(graphManager,canvas,x,y,graph,text){
    this.graphManager = graphManager;
    this.canvas = canvas;
    this.graph = graph;
    this.x = x ;
    this.y = y;
    this.width =150;
    this.height = 30;
    this.text = text;
    this.isCurrent=false;
    this.fillStyle = '#dddddd';
    this.type = 'menuItem';
  }

  isPointIn(x1,y1){
    if(x1 > this.x && x1 < this.x + this.width  && y1 > this.y&& y1 < this.y + this.height ){
      return true;
    }
    return false;
  }
  onmousemove(e){
    //todo:坐标转换
    let coordinateT = new CoordinateT(e.clientX, e.clientY, this.canvas);
    let x = coordinateT.calculate().x;
    let y = coordinateT.calculate().y;
    if(this.isPointIn(x, y)){
      this.fillStyle = 'yellow';
    }else{
      this.fillStyle = '#dddddd';
    }
  }

  click(){}

  draw(){
    this.isCurrent=true;
    let ctx = this.canvas.getContext('2d');
    ctx.save();
    ctx.shadowColor="#999999";
    ctx.strokeStyle ='hsl(120,50%,50%)';

    ctx.shadowBlur=2;
    ctx.shadowOffsetX=2;
    ctx.shadowOffsetY=2;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.lineTo(this.x + 150,this.y);
    ctx.lineTo(this.x + 150,this.y + 30);
    ctx.lineTo(this.x,this.y + 30);
    //ctx.fillStyle = '#dddddd';
    ctx.fillStyle = this.fillStyle;
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font="15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.text,this.x + 70,this.y + 20,150);
    ctx.restore();
  }

}
