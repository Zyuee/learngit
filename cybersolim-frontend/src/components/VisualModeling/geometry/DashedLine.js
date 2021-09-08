/**
 * Created by lp on 2017/6/15.
 */

/**
 *
 * 虚线类
 * @class DashedLine
 *
 * */
export default class DashedLine{
  constructor(x, y, x2, y2, dashArray, ctx){
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.dashArray = dashArray;
    this.ctx = ctx;
  }
  draw(){
    if(! this.dashArray) this.dashArray=[10,5];
    let dashCount = this.dashArray.length;
    let dx = (this.x2 - this.x);
    let dy = (this.y2 - this.y);
    let xSlope = (Math.abs(dx) > Math.abs(dy));
    let slope = (xSlope) ? dy / dx : dx / dy;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    let distRemaining = Math.sqrt(dx * dx + dy * dy);
    let dashIndex = 0;
    while(distRemaining >= 0.1){
      let dashLength = Math.min(distRemaining, this.dashArray[dashIndex % dashCount]);
      let step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
      if(xSlope){
        if(dx < 0) step = -step;
        this.x += step;
        this.y += slope * step;
      }else{
        if(dy < 0) step = -step;
        this.x += slope * step;
        this.y += step;
      }
      if(dashIndex % 2 === 0){
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = '#32CD32';
        this.ctx.stroke();
      }
      else if(dashIndex % 2 !== 0){
        this.ctx.moveTo(this.x, this.y);
      }
      distRemaining -= dashLength;
      dashIndex++;
    }
  }
}
