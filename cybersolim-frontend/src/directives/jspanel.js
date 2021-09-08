/**
 * 自定义指令
 * @see http://cn.vuejs.org/v2/guide/custom-directive.html
 * @see http://www.cnblogs.com/handoing/p/5866830.html
 * @see http://www.myronliu.com/2017/01/31/vue/vue_mixins_directive/
 * @see http://wiki.jikexueyuan.com/project/vue-js-1.0/custom-directive.html
 * @author houzhiwei
 */

import $ from 'jquery'
import 'jspanel'

const jspanel = {
  bind( el, binding, vnode ) {
    // console.log('bind');
  },
  inserted( el, binding, vnode ) {
    /*console.log(binding);*/
    let options = binding.value.panel;// jsPanel options
    let show = binding.value.show; // show component
    // el: 整个jspanel对象
    // 构造包含content选项的jsPanel选项，将组件及内部（slot）元素显示在panel之中
    Object.assign(options, { content: el }); // combine opt with an object, now opt gets a new property "content"
    // let opt = {}; // jsPanel options
    // Object.assign(opt, { content: el }, options);
    if (show) {
      // 记录panel，用于close等操作. 使用vnode来共享数据。Vue官方推荐使用dataset来在钩子间共享数据
      vnode.panel = null;
      vnode.panel = $.jsPanel(options);
    }
  },
  componentUpdated() {
    //被绑定元素所在模板完成一次更新周期时调用。
    // console.log('componentUpdated');
  },
  update( el, binding, vnode, oldVnode ) {
    //被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新
    // 将panel绑定到新的vnode上。没有这一句会报错，不能实现指令在多个地方使用时的数据隔离。？
    vnode.panel = oldVnode.panel;
  },
  unbind( el, binding, vnode ) {
    vnode.panel.close(); // 关闭当前的panel
  }
}
export default jspanel;
