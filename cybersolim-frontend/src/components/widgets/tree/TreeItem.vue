<!--
references:
tree：https://github.com/weibangtuo/vue-tree/blob/master/src/tree.vue.js
context menu：https://github.com/vmaimone/vue-context-menu
-->
<template>
  <li :class="{parent_li: node.isParent}">
    <i v-if="node.isParent " @click.prevent="toggle(node)" style="font-size:16px;"
       :class='{"ivu-icon ivu-icon-md-add": !node.isOpen , "ivu-icon ivu-icon-md-remove": node.isOpen}'
       aria-hidden="true"></i>
    <!--复选框-->
    <i v-if="node.checkable" @click.prevent="toggleCheck(node)" style="font-size:16px;"
       :class='{"ivu-icon ivu-icon-md-checkbox": node.checked, "ivu-icon ivu-icon-md-square-outline": !node.checked}'
       aria-hidden="true"></i>
    <!--title表示提示-->
    <span :title="node.name" v-if="showCtxMenu" @contextmenu.prevent="openCtx($event, node)">
        <i v-if="showIcon(node)" :class="nodeClass(node)" aria-hidden="true" style="font-size:16px;"></i>{{node.title}}
    </span>
    <span :title="node.name" v-else>
        <i v-if="showIcon(node)" :class="nodeClass(node)" aria-hidden="true" style="font-size:16px;"></i>{{node.title}}
    </span>
    <!--按钮-->
    <a v-for="button in buttons" v-if="node.buttons && node.buttons.indexOf(button.key)>-1" class="ml5"
       :title="button.text"
       @click.prevent="btnClick(button, node)" @dblclick.prevent="bdlBtnClick(button, node)">
      <i aria-hidden="true" :class="btnClass(button)" style="font-size:16px;"></i>
    </a>
    <ul v-show="node.isOpen">
      <li v-show="loading && node._loading">
        <i class="ivu-icon ivu-icon-ios-loading" aria-hidden="true" style="font-size:16px;"></i>
      </li>
      <vue-tree-item v-for="item in node.children" :tree-node="item" :parent-node="node"
                     :key="item.id" :show-ctx-menu="showCtxMenu" :ctx-ref="ctxRef" :loading="loading"
                     @ctxMenuClick="getNodeFn" :get-node-fn="getNodeFn" :buttons="buttons">
      </vue-tree-item>
    </ul>
  </li>
</template>

<script>
  import contextMenu from 'vue-context-menu'
  import { mapState } from 'vuex'

  export default {
    name: 'vue-tree-item',
    data () {
      return {
        timer:null,
      }
    },
    components: {
      contextMenu
    },
    computed: {
      node () {
        return this.treeNode
      },
      parent () {
        return this.parentNode
      }
    },
    methods: {
      showIcon: node => {
        return node.icon || node.openedIcon || node.closedIcon
      },
      nodeClass: node => {
        if (node.isOpen) {
          return node.openedIcon || node.icon
        }
        else {
          return node.closedIcon || node.icon
        }
      },
      btnClass: button => {
        if (button.icon) {
          return "ivu-icon ivu-icon-"+button.icon;
        }
        else {
          return "ivu-icon ivu-icon-md-grid"
        }
      },
      // 展开、闭合切换
      toggle: function( node ) {
        //箭头函数中不能使用this
        if (node.hasOwnProperty('isOpen')) {
          node.isOpen = !node.isOpen
        }
        else {
          this.$set(node, 'isOpen', true)
        }
      },
      checkChildren: function( node ) {
        // 若为父节点，则同时控制子节点的选中状态
        if (node.isParent) {
          for (let child of node.children) {
            child.checked = node.checked
            this.checkChildren(child)
          }
        }
      },
      toggleCheck: function( node ) {
        if (node.hasOwnProperty('checked')) {
          node.checked = !node.checked
        }
        else {
          this.$set(node, 'checked', true)
        }
        let val = node.checked
        this.checkChildren(node)
      },
      // 单击结点后按钮
      btnClick: ( btn, node ) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          //这里面写单击事件的逻辑
          if (typeof btn.click==='function') {
            btn.click(node);
          }
        }, 300);    //定时器时间
      },
      //双击结点后按钮
      bdlBtnClick: (btn, node) => {
        clearTimeout(this.timer);   //清除定时器，然后在后面直接写双击事件的逻辑
        if (typeof btn.click==='function') {
          btn.click(node);
        }
      },
      // 展开右键菜单
      openCtx( event, node ){
        this.ctxRef.open(event, node);
        // 触发ctxMenuClick，传递结点值
        this.$emit('ctxMenuClick', node);
      },
      nodeSetting(){
        //根据数据设置属性
        this.$set(this.node, 'isOpen', false)
        //      如果定义了children且大于0
        if ((this.node.children && this.node.children.length > 0) || this.node.parentId===0) {
          this.$set(this.node, 'isParent', true)
          this.$set(this.node, 'openedIcon', 'ivu-icon ivu-icon-ios-folder-open-outline')
          this.$set(this.node, 'closedIcon', 'ivu-icon ivu-icon-ios-folder-outline')
        }
        else {
          //  叶子
          this.$set(this.node, 'isParent', false)
          if (!this.node.icon) // 不存在icon属性
            this.$set(this.node, 'icon', 'ivu-icon ivu-icon-md-grid')
          else
            this.node.icon = 'ivu-icon ivu-icon-md-grid'
        }
        // 复选框
        if (this.node.checkable) {
          if (this.node.children) {
            for (let child of this.node.children) {
              if (!child.hasOwnProperty('checkable')) {
                this.$set(child, 'checkable', true)
              }
            }
          }
          //TODO 默认选择非根节点时，没有选中？
          if (!this.node.hasOwnProperty('checked') || !this.node.checked) {
            this.$set(this.node, 'checked', false)
          }
          else {
            this.$set(this.node, 'checked', true)
          }
        }
        //TODO 默认选择非根节点时，没有选中？
        if (!this.node.hasOwnProperty('checked') || !this.node.checked) {
          this.$set(this.node, 'checked', false);
        }
        else {
          this.$set(this.node, 'checked', true);
        }
      }
    },
    mounted () {
    },
    created () {
      this.nodeSetting();
    },
    watch: {
      'node.isOpen': function( val ) {
        if (!this.node.hasOwnProperty('_loading')) {
          this.$set(this.node, '_loading', false)
        }
        if (val) {
          if (typeof this.node.onOpened==='function') {
            this.node.onOpened(this.node)
          }
        }
        else {
          if (typeof this.node.onClosed==='function') {
            this.node.onClosed(this.node)
          }
        }
      },
      'node.checked': function( val ) {
        if (this.parent) {
          if (val && !this.parent.checked) {
            this.parent.checked = val
          }
          // 子节点取消选中时，若没有兄弟结点处于选中状态，父节点为未选中状态
          if (!val && this.parent.children) {
            for (let i = this.parent.children.length - 1; i >= 0; i--) {
              let sibling = this.parent.children[i];
              if (sibling.id===this.node.id && i > 0)
                continue;
              else if (sibling.checked) {
                break
              }
              else if (i===0) {
                this.parent.checked = false
              }
            }
          }
        }
      },
      node: function() {
        this.nodeSetting();
      }
    },
    props: {
      treeNode: {
        type: Object,
        default () {
          return {
            isParent: false,
            children: []
          }
        }
      },
      parentNode: {
        type: Object,
        default () {
          return {}
        }
      },
      showCtxMenu: {
        type: Boolean,
        default: false,
        required: false
      },
      ctxRef: {
        type: Object,
        required: true,
        default(){
          return {};
        }
      },
      getNodeFn: {
        type: Function,
        required: true
      },
      buttons: {
        type: Array,
        default(){
          return [];
        },
        required: false
      },
      loading: {
        type: Boolean,
        default: false,
        required: false
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/context-menu.scss";
</style>
