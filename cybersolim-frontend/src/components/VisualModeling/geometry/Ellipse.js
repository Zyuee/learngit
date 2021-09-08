/**
 * Created by lp on 2017/6/15.
 */
import Polygon from './Polygon';
/**
 *
 *椭圆类
 * @class Ellipse
 *
 * */
export default class Ellipse extends Polygon{
  constructor(x,y,a,b,label,canvas){
    super(x,y,a,b,label,canvas);
    //类型为椭圆
    this.type = 'ellipse';
    //是否为中间结果
    this.interMediateResult = false;
    //是否有值
    this.hasValue = false;
    this.lastValue = false;
    //当有值时，绘制椭圆阴影
    this.hasShadow = false;
    this.defaultFillStyle = '#e2a896';
    this.beSelectedFillStyle = '#ff8c00';
    this.hasVlueFillStyle = '#9acd32';
  }
  isPointIn(x1,y1){
    let s = (this.x-x1)*(this.x-x1) / (this.a * this.a) + (this.y-y1)*(this.y-y1) / (this.b * this.b);
    if(s < 1.0){
      return true;
    }
    return false;
  }

  draw(){
    if(this.label === "Uncertainty Map")
      return;
    let ctx = this.canvas.getContext('2d');
    ctx.save();
    if(this.hasValue)
    {
      this.hasShadow = true;
      ctx.shadowColor='#999999';
      ctx.shadowBlur=5;
      ctx.shadowOffsetX=5;
      ctx.shadowOffsetY=5;
      this.fillStyle = this.hasVlueFillStyle;
    }else{
      if(this.isCurrent===true){
        this.fillStyle = this.beSelectedFillStyle;
      }else{
        //this.fillStyle = '#999999';
        this.fillStyle = this.defaultFillStyle;
      }
    }
    ctx.scale(1, this.b / this.a);
    ctx.beginPath();
    if(this.y <40){
      this.y = 40;
    }
    ctx.arc(this.x,this.y / (this.b / this.a),this.a,2*Math.PI,0,true);
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font="15px Arial";
    ctx.textAlign = "center";
    let _array = this.label.split(" ");
    let len = _array.length;
    if(len ===1){
      ctx.fillText(this.label,this.x,this.y,this.a*2);
    }else if(len > 1){
      for(let i =0 ;i< len ;i++){
        ctx.fillText(_array[i],this.x,this.y - 10 + i*12,this.a*2);
      }
    }
    ctx.restore();
  }

  setDefaultFillStyle(mFillStyle){
    this.defaultFillStyle = mFillStyle;
  }

}

