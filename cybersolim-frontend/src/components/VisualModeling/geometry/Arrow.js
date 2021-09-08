/**
 * Created by lp on 2017/6/15.
 */
import Geometry from './Geometry';
import DashedLine from './DashedLine';
/**
 *
 * 箭头类
 * @class Arrow
 *
 * */
export default class Arrow extends Geometry{
  constructor(start,end, canvas){
    super(canvas);
    this.type = 'arrow';
    this.isReady = false;
    this.start =start;
    this.end = end;
  }

  crossMul(point1,point2){
    return   point1.x * point2.y - point1.y * point2.x;
  }

  checkCross(p1,p2,p3,p4){
    let v1={x:p1.x-p3.x,y:p1.y-p3.y};
    let v2={x:p2.x-p3.x,y:p2.y-p3.y};
    let v3={x:p4.x-p3.x,y:p4.y-p3.y};
    let v=this.crossMul(v1,v3)*this.crossMul(v2,v3);
    v1={x:p3.x-p1.x,y:p3.y-p1.y};
    v2={x:p4.x-p1.x,y:p4.y-p1.y};
    v3={x:p2.x-p1.x,y:p2.y-p1.y};
    return (v <= 0 && this.crossMul(v1,v3) * this.crossMul(v2,v3)<=0) ? true : false
  }
  draw(){
    let ctx = this.canvas.getContext('2d');

    this.linewidth = 1.5;
    this.linecolor = '#999999';
    //var len = Math.sqrt((this.start.x -this.end.x)*(this.start.x -this.end.x)+(this.start.y -this.end.y)*(this.start.y -this.end.y));
    let x1;
    let y1;
    let x2;
    let y2;

    if(this.start.type === 'ellipse'){
      let xs = 0;
      let ys = 0;
      let xe = this.end.x - this.start.x;
      let ye = this.end.y - this.start.y;
      let a = this.start.a;
      let b = this.start.b;

      if(xe !== xs){
        let k = (ye - ys) / (xe - xs);
        if(xe - xs > 0){
          x1 = Math.sqrt((a * a * b * b)/(b * b + a * a * k * k));
          y1 = k * x1;
        }
        else{
          x1 = -1.0 * Math.sqrt(( a * a * b * b)/( b * b + a * a * k * k));
          y1 = k * x1;
        }
      }
      else if(xe = xs){
        x1 = xe;
        if(ye - ys > 0){
          y1 = Math.sqrt((a * a * b * b - b * b * x1 * x1)/(a * a));
        }
        else{
          y1 = -1.0*Math.sqrt((a * a * b * b - b * b * x1 * x1)/(a * a));
        }
      }
      x1 = x1 + this.start.x ;
      y1 = y1 + this.start.y;
    }
    else  if(this.start.type === 'rectangle'){
      let p1 ={x:this.start.x,y:this.start.y};
      let p2 ={x:this.end.x,y:this.end.y};
      let p3 = {x:this.start.x - this.start.a / 2.0,y:this.start.y - this.start.b / 2.0};
      let p4 = {x:this.start.x + this.start.a / 2.0,y:this.start.y - this.start.b / 2.0};
      let p5 = {x:this.start.x - this.start.a / 2.0,y:this.start.y + this.start.b / 2.0};
      let p6 = {x:this.start.x + this.start.a / 2.0,y:this.start.y + this.start.b / 2.0};
      let p7 = {x:this.start.x - this.start.a / 2.0,y:this.start.y - this.start.b / 2.0};
      let p8 = {x:this.start.x - this.start.a / 2.0,y:this.start.y + this.start.b / 2.0};
      let p9 = {x:this.start.x + this.start.a / 2.0,y:this.start.y - this.start.b / 2.0};
      let p10 = {x:this.start.x + this.start.a / 2.0,y:this.start.y + this.start.b / 2.0};
      if(this.checkCross(p1,p2,p3,p4)){
        y1 = this.start.y - this.start.b / 2.0;
        x1 = this.start.x - (this.start.y - y1)*(this.start.x - this.end.x)/(this.start.y - this.end.y);
      }else if(this.checkCross(p1,p2,p5,p6)){
        y1 = this.start.y + this.start.b / 2.0;
        x1 = this.start.x - (this.start.y - y1)*(this.start.x - this.end.x)/(this.start.y - this.end.y);
      }else if(this.checkCross(p1,p2,p7,p8)){
        x1 = this.start.x - this.start.a / 2.0;
        y1 = this.end.y + (x1 - this.end.x)*(this.start.y -this.end.y)/(this.start.x - this.end.x);
      }else if (this.checkCross(p1,p2,p9,p10)){
        x1 = this.start.x + this.start.a / 2.0;
        y1 = this.end.y + (x1 - this.end.x)*(this.start.y -this.end.y)/(this.start.x - this.end.x);
      }
    }

    if(this.end.type === 'rectangle'){
      let p1 ={x:this.start.x,y:this.start.y};
      let p2 ={x:this.end.x,y:this.end.y};
      let p3 = {x:this.end.x - this.end.a / 2.0,y:this.end.y - this.end.b / 2.0};
      let p4 = {x:this.end.x + this.end.a / 2.0,y:this.end.y - this.end.b / 2.0};
      let p5 = {x:this.end.x - this.end.a / 2.0,y:this.end.y + this.end.b / 2.0};
      let p6 = {x:this.end.x + this.end.a / 2.0,y:this.end.y + this.end.b / 2.0};
      let p7 = {x:this.end.x - this.end.a / 2.0,y:this.end.y - this.end.b / 2.0};
      let p8 = {x:this.end.x - this.end.a / 2.0,y:this.end.y + this.end.b / 2.0};
      let p9 = {x:this.end.x + this.end.a / 2.0,y:this.end.y - this.end.b / 2.0};
      let p10 = {x:this.end.x + this.end.a / 2.0,y:this.end.y + this.end.b / 2.0};
      if(this.checkCross(p1,p2,p3,p4)){
        y2 = this.end.y - this.end.b / 2.0;
        x2 = this.start.x + (y2 - this.start.y)*(this.end.x - this.start.x)/(this.end.y - this.start.y);
      }else if(this.checkCross(p1,p2,p5,p6)){
        y2 = this.end.y + this.end.b / 2.0;
        x2 = this.start.x + (y2 - this.start.y)*(this.end.x - this.start.x)/(this.end.y - this.start.y);
      }else if(this.checkCross(p1,p2,p7,p8)){
        x2 = this.end.x - this.end.a / 2.0;
        y2 = this.start.y + (x2 - this.start.x)*(this.end.y -this.start.y)/(this.end.x - this.start.x);
      }else if (this.checkCross(p1,p2,p9,p10)){
        x2 = this.end.x + this.end.a / 2.0;
        y2 = this.start.y + (x2 - this.start.x)*(this.end.y -this.start.y)/(this.end.x - this.start.x);
      }

    }
    else if(this.end.type === 'ellipse'){
      let xe = 0;
      let ye = 0;
      let xs = this.start.x - this.end.x ;
      let ys = this.start.y - this.end.y;
      let a = this.end.a;
      let b = this.end.b;

      if(xs !== xe){
        let k = (ye - ys) / (xe - xs);
        if(xs - xe > 0){
          x2 = Math.sqrt((a * a * b * b) / (b * b + a * a * k * k));
          y2 = k * x2;
        }
        else{
          x2 = -1.0 * Math.sqrt((a * a * b * b) / (b * b + a * a * k * k));
          y2 = k * x2;
        }
      }
      else if(xe = xs){
        x1 = xe;
        if(ys - ye > 0){
          y2 = Math.sqrt((a * a * b * b - b * b * x1 * x1) / (a * a));
        }
        else{
          y2 = -1.0*Math.sqrt((a * a * b * b - b * b * x1 * x1) / (a * a));
        }
      }

      x2 = x2 + this.end.x ;
      y2 = y2 + this.end.y;
    }

    ctx.lineWidth = this.linewidth;

    if(! this.isReady){
      this.linecolor = '#32CD32';
      ctx.lineCap = 'round';
      let dashedLine = new DashedLine(x1,y1,x2,y2,[10,5], ctx);
      dashedLine.draw();
      //dashedLine(x1,y1,x2,y2,[10,5], ctx);
    }
    else if(this.isReady){
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      this.linecolor = 'green';
      ctx.strokeStyle = this.linecolor;
      ctx.stroke();
    }

    // draw the arrow
    let ang = Math.atan2(y2 - y1,x2 - x1);
    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(ang + Math.PI*0.75);
    ctx.strokeStyle = this.linecolor;
    ctx.lineWidth = this.linewidth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0,10);
    ctx.lineTo(10,0);
    ctx.closePath();
    ctx.fillStyle = this.linecolor;
    ctx.fill();
    ctx.restore();
  }


}
