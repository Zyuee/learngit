/**
 * Created by lp on 2017/6/16.
 * 全局坐标轴转换为canvas坐标
 */


export default class CoordinateT{
  constructor(x, y, canvas){
    this.x = x;
    this.y = y;
    this.canvas = canvas;
  }
  calculate(){
    let x_T = this.x - this.canvas.getBoundingClientRect().left + this.canvas.scrollLeft;
    let y_T = this.y - this.canvas.getBoundingClientRect().top + this.canvas.scrollTop;
    return ({x:x_T, y:y_T});
  }
}
