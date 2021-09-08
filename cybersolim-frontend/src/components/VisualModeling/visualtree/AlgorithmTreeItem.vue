<!--
参考：https://github.com/weibangtuo/vue-tree/blob/master/src/tree.vue.js
-->
<template>

  <!--<li v-if="node.isRoot" :class="{parent_li: node.isParent}">-->
  <li v-if="node.rootNode" :class="{parent_li: node.isParent}">
    <ul v-show="node.isOpen">
      <li v-show="node.showLoading && node._loading">
        <i class="ivu-icon ivu-icon-ios-loading" aria-hidden="true"
           style="font-size:16px;"></i>
      </li>
      <vue-tree-item v-for="item in node.children" :tree-node="item"
                     :parent-node="node" :key="item.id"></vue-tree-item>
    </ul>
  </li>

  <li v-else="!node.rootNode" :class="{parent_li: node.isParent}">

    <i v-if="node.isParent" @click.prevent="toggle(node)"
       style="font-size:16px;"
       :class='{"ivu-icon ivu-icon-md-add": !node.isOpen, "ivu-icon ivu-icon-md-remove": node.isOpen}'
       aria-hidden="true"></i>

    <span :title="node.title" @click="showAlgorithm(node)">
        <i v-if="showIcon(node)" :class="nodeClass(node)" aria-hidden="true">
        </i>
      {{node.name}}
    </span>
    <ul v-show="node.isOpen">
      <!--<li v-show="node.showLoading && node._loading">-->
      <!--<i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>-->
      <!--</li>-->
      <vue-tree-item v-for="item in node.children" :tree-node="item"
                     :parent-node="node" :key="item.id"></vue-tree-item>
    </ul>
  </li>
</template>

<script>
  import myBus from '../myBus'

  export default {
    name: 'vue-tree-item',
    data() {
      return {
        node: {},
        parent: {}
      }
    },
    components: {},
    methods: {
      showIcon: node => {
        return node.icon || node.openedIcon || node.closedIcon;
      },
      nodeClass: node => {
        if (node.isOpen) {
          return node.openedIcon || node.icon;
        } else {
          return node.closedIcon || node.icon;
        }
      },
      toggle: function (node) {
        //箭头函数中不能使用this
        if (node.hasOwnProperty('isOpen')) {
          node.isOpen = !node.isOpen;
        } else {
          this.$set(node, 'isOpen', true);
        }
      },
      checkChildren: function (node) {
        // 若为父节点，则同时控制子节点的选中状态
        if (node.isParent) {
          for (let child of node.children) {
            child.checked = node.checked;
            this.checkChildren(child);
          }
        }
      },
      toggleCheck: function (node) {
        if (node.hasOwnProperty('checked')) {
          node.checked = !node.checked;
        } else {
          this.$set(node, 'checked', true);
        }
        this.checkChildren(node);
      },
      btnClick: (btn, node) => {
        if (typeof btn.click === 'function') {
          btn.click(node);
        }
      },
      showAlgorithm: function (node) {
        myBus.$emit('my-algorithm', node.name)
      },
      setData() {
        this.node = this.treeNode;
        this.parent = this.parentNode;
        //根据数据设置属性
        //this.$set(this.node, 'isOpen', true);
        //this.$set(this.node, 'isRoot', true);
        //      如果定义了children且大于0
        if (this.node.children && this.node.children.length > 0) {
          this.$set(this.node, 'isParent', true);
          this.$set(this.node, 'openedIcon', 'ivu-icon ivu-icon-ios-folder-open-outline');
          this.$set(this.node, 'closedIcon', 'ivu-icon ivu-icon-ios-folder-outline');
        } else {
          //      叶子
          this.$set(this.node, 'isParent', false);
          if (!this.node.icon) // 不存在icon属性
            this.$set(this.node, 'icon', 'ivu-icon ivu-icon-md-grid');
          else
            this.node.icon = 'ivu-icon ivu-icon-md-grid';
        }
        if (this.node.rootNode) {
          this.$set(this.node, 'isOpen', true);
        }
      }
    },
    created() {
      this.setData();
    },
    mounted() {
    },
    watch: {
      treeNode: function (newVal) {
        this.node = newVal;
        this.setData();
      },
      'node.isOpen': function (val) {
        if (!this.node.hasOwnProperty('_loading')) {
          this.$set(this.node, '_loading', false);
        }
        if (val) {
          if (typeof this.node.onOpened === 'function') {
            this.node.onOpened(this.node);
          }
        } else {
          if (typeof this.node.onClosed === 'function') {
            this.node.onClosed(this.node);
          }
        }
      },
      'selectName': function (val, oldval) {
        console.log(val)
        console.log(oldval)
        this.$emit('my-algorithm', val)
      }
    },
    props: {
      treeNode: {
        type: Object,
        default() {
          return {
            isParent: false,
            children: []
          }
        }
      },
      parentNode: {
        type: Object,
        default() {
          return {};
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
