/**
 * Created by lp on 2017/6/14.
 */

/**
 *
 * Geometry 是所有形状的基类
 * @class Geometry
 *
 * */
export default class Geometry{
  constructor(canvas){
    //canvas
    this.canvas = canvas;
    //the type of geometry, such as arrow、rectangle and so on
    this.type = '';
    // judge whether the geometry is selected
    this.isCurrent=false;
    // judge whether is the left button
    this.isLeftKeyDown=false;
    // judge whether is the right button
    this.isRightKeyDown=false;
    //
    this.isMounseMove=false;
    this.isKeyUp=true;
    //record the fill color of geometry
    this.fillStyle = '';
  }
  fakemousedown(){}
  onmousedown(){}
  onmousemove(){}
  onmouseup(){}
  draw(){}

}
