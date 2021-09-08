/**
 * Created by lp on 2017/6/15.
 */
import Geometry from './Geometry';
import CoordinateT from '../model/CoordinateT';
/**
 * 多边形类，是椭圆、矩形等的基类
 * @class Polygon
 * */
export default class Polygon extends Geometry{
  constructor(x,y,a,b,label,canvas){
    super(canvas);
    //矩形左上角的 x 坐标 or 圆的中心的 x 坐标
    this.x = x;
    //矩形左上角的 y 坐标 or 圆的中心的 y 坐标
    this.y = y;
    //矩形的宽度，以像素计 or 椭圆长轴半径
    this.a = a;
    //矩形的高度，以像素计 or 椭圆短轴半径
    this.b = b;
    //形状的标签
    this.label = label;
  }

  //判断鼠标是否落在该几何内部
  isPointIn(x,y){}
  //绘制几何形状
  draw(){}

  //
  fakemousedown(){
    this.isCurrent=false;
    this.fillStyle = '#B0E2FF';
  }

  //鼠标点击
  onmousedown(e){
    let coordinateT = new CoordinateT(e.clientX, e.clientY, this.canvas);
    let x = coordinateT.calculate().x;
    let y = coordinateT.calculate().y;
    if(this.isPointIn(x,y)){
      if(e.button === 0){
        this.isLeftKeyDown = true;
        this.isCurrent=true;
        this.fillStyle = '#ff8c00';

      }else if(e.button === 2){
        this.isRightKeyDown = true;
        this.isCurrent=true;
        this.fillStyle = '##ff8c00';
      }
    }else{
      this.isCurrent=false;
      this.fillStyle = '#B0E2FF';
    }
  }

  //鼠标移动
  onmousemove(e){
    if(this.isLeftKeyDown === true){
      let coordinateT = new CoordinateT(e.clientX, e.clientY, this.canvas);
      let x = coordinateT.calculate().x;
      let y = coordinateT.calculate().y;
      this.x = x;
      this.y = y;
    }
  }


  onmouseup(e){
    this.isLeftKeyDown=false;
    this.isRightKeyDown=false;
    this.isMounseMove=false;
    this.isKeyUp=true;
  }
}
