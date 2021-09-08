/**
 * Created by lp on 2017/6/16.
 */
import Ellipse from '../geometry/Ellipse';

/**
 *
 * 数据类，继承Ellipse
 * @class Data
 * 为输入/输出图形 add by yrx on 2020/07/23
 *
 * */
export default class Data extends Ellipse{
  constructor(x,y,a,b,label,canDerive,format,canvas){
  // constructor(x,y,a,b,label,canvas){
    super(x,y,a,b,label,canvas);
    this.dataName = label;
    this.value = [];
    this.valueFromPreTask = [];
    this.canDerive = canDerive;
    this.dataFormat = format;
  }
  // set value(value){
  //   this.value = [];
  //   for(let i =0;i < value.length; i++){
  //     this.value.push(value[i]);
  //   }
  // }
  setValue(value){
    // for(let i =0;i < value.length; i++){
    //   this.value.push(value[i]);
    // }
    this.value = value;
  }
  // get value(){
  //   return this.value;
  // }
  getValue(){
    return this.value;
  }

  setValueFromPreTask(value){
    this.valueFromPreTask = value;
  }

  getValueFromPreTask(){
    return this.valueFromPreTask;
  }

  /**
   *
   * 检查该数据是否已经被赋值
   * @method check
   *
   * */
  check(){
    if(this.value.length === 0 && this.valueFromPreTask.length === 0){
      this.hasValue = false;
    }else {
      this.hasValue = true;
    }
  }

  /**
   * 判断该元素能够派生
   */
  isCanDerive(){
    return this.canDerive;
  }
}
