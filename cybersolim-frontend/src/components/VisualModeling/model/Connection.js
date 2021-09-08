/**
 * Created by lp on 2017/6/16.
 */
import Arrow from '../geometry/Arrow';
/**
 *
 * 连接类
 * @class Connection
 *
 * */
export default class Connection extends Arrow{
  constructor(start,end,canvas){
    super(start,end,canvas);
    this.data = null;
    this.task = null;
  }
  /**
   *
   * 初始化连接的头和尾连接对象
   * @method init
   *
   * */
  init(){
    if(this.start.type ==="rectangle"){
      this.task = this.start;
    }else if (this.start.type ==="ellipse"){
      this.data = this.start;
    }
    if(this.end.type ==="rectangle"){
      this.task = this.end;
    }else if (this.end.type ==="ellipse"){
      this.data = this.end;
    }
  }

  //检查连接两端的任务和数据是否都ready
  check(){
    if(this.start.type ==="rectangle" && this.end.type ==="ellipse"){
      if(this.start.nextTasks.length === 0){
        this.end.check();
        if(this.end.hasValue){
          this.isReady = true;
        }else {
          this.isReady = false;
        }
      }else{
        this.isReady = true;
      }

    }else if(this.start.type ==="ellipse" && this.end.type ==="rectangle"){
      this.start.check();
      if(this.start.hasValue){
        this.isReady = true;
      }else {
        this.isReady = false;
      }
    }else {
      this.isReady = false;
    }
  }
}
