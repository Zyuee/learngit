/**
 * Created by lp on 2017/6/16.
 */

export default class Parameter{
  constructor(parametername){
    this.parametername = parametername;
    this.parameterType = null;
    this.parameterSemantic = null;
    this.value = [];
  }

  // set value(value){
  //   this.value = [];
  //   for(var i =0;i<value.length; i++){
  //     this.value.push(value[i]);
  //   }
  // }
  setValue(value){
    this.value = [];
    for(let i =0;i < value.length; i++){
      this.value.push(value[i]);
    }
  }
  // get value(){
  //   return this.value;
  // }
  getValue(){
    return this.value;
  }
}
