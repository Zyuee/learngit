/**
 * Created by lp on 2017/6/15.
 */
import Polygon from './Polygon';

/**
 *
 * 矩形类
 * @class Recatangle
 *为模型主体 add by yrx on 2020/07/23
 * */
export default class Rectangle extends Polygon{
  constructor(x,y,width,height,label,canvas){
    super(x,y,width,height,label,canvas);
    this.type = 'rectangle';
    //记录单个任务是否可以运行
    this.isReadyToRun = false;
    this.hasShadow = false;
    //记录图形工作流中所有任务是否都可以运行
    this.canRun = false;
  }
  isPointIn(x1,y1){
    if(x1 > this.x - this.a / 2.0 && x1 < this.x + this.a / 2.0 && y1 > this.y - this.b / 2.0 && y1 < this.y + this.b / 2.0){
      return true;
    }
    return false;
  }

  draw(){
    let ctx = this.canvas.getContext('2d');
    ctx.save();

    let fillStyle = '#B0E2FF';
    if(this.isReadyToRun){
      if(this.canRun === true){
        this.hasShadow = true;
        ctx.shadowColor='#999999';
        ctx.shadowBlur=5;
        ctx.shadowOffsetX=5;
        ctx.shadowOffsetY=5;
        fillStyle = '#25dad4';
      }else{
        this.hasShadow = true;
        ctx.shadowColor='#999999';
        ctx.shadowBlur=5;
        ctx.shadowOffsetX=5;
        ctx.shadowOffsetY=5;
        fillStyle = '#ddff8c';
      }
    }
    ctx.beginPath();
    if(this.y < 40){
      this.y = 40;
    }
    ctx.moveTo(this.x - this.a / 2.0,this.y - this.b / 2.0);
    ctx.lineTo(this.x + this.a / 2.0,this.y - this.b / 2.0);
    ctx.lineTo(this.x + this.a / 2.0,this.y  + this.b / 2.0);
    ctx.lineTo(this.x - this.a / 2.0,this.y  + this.b / 2.0);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();

    ctx.save();
    //ctx.fillStyle = '#000000';
    ctx.font="15px Arial";
    ctx.textAlign = "center";
    let temp = this.label;
    let _array = temp.split(" ");
    let len = _array.length;
    if(len ===1){
      ctx.fillText(this.label,this.x ,this.y,this.a * 2);
    }else if(len > 1){
      for(let i =0; i<len ; i++){
        ctx.fillText(_array[i],this.x  ,this.y -10 + i*12,this.a * 2);
      }
    }
    ctx.restore();
  }
}
