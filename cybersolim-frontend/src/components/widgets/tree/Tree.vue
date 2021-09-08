<template>
  <div class="vue-tree">
    <!--右键菜单-->
    <context-menu ref="ctx">
      <li v-for="menu in contextMenus" class="ctx-item" @click.prevent="ctxClick(menu)">{{menu.text}}</li>
    </context-menu>
    <ul>
      <lazy-render :time="300">
        <tree-item :tree-node="option.root" :show-ctx-menu="showCtxMenu" :ctx-ref="ctx" @ctxMenuClick="getNode"
                   :get-node-fn="getNode" :buttons="buttons" :loading="loading">
        </tree-item>
      </lazy-render>
    </ul>
  </div>
</template>

<script>
  import TreeItem from './TreeItem'
  import contextMenu from 'vue-context-menu'

  export default {
    name: 'vue-tree',
    data() {
      return {
        ctxNode: {},
        ctx: this.$refs.ctx // undefined
      }
    },
    components: {
      'tree-item': TreeItem, contextMenu
    },
    methods: {
      // 获取点击结点的值
      getNode( node ){
        this.ctxNode = node;
      },
      // 右键选项单击时
      ctxClick( menu ){
        if (typeof menu.click==='function') {
          menu.click(this.ctxNode);
        }
      }
    },
    mounted(){
      // ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在！
      // $refs 也不是响应式的，因此你不应该试图用它在模版中做数据绑定。
      this.ctx = this.$refs.ctx; // update ctx
    },
    computed: {
      showCtxMenu(){
        return this.contextMenus.length > 0;
      }
    },
    props: {
      option: {
        type: Object,
        required: true,
        default() {
          return {
            root: {
              name: 'Tree root name',
              title: 'Tree root title',
              id: 0,
              parentId:-1,
              isParent: true,
              children: [{
                name: 'Test',
                title: 'Test',
                id: 1,
                children: [
                  {
                    name: 'sub',
                    title: 'sub test',
                    id: 3,
                    buttons: [
                      {
                        text: 'Show on map',
                        icon: 'md-grid',
                        click: node => {
                          console.log(node); // 本结点
                          vIziToast.success(node.id);
                        }
                      }
                    ],
                    children:[]
                  }
                ]
              }],
              icon: 'md-folder',
              openedIcon: 'md-folder-open',
              closedIcon: 'md-folder',
              buttons: ['detail'],
              onOpened: node => { },
              onClosed: node => { }
            },
            showLoading: false
          }
        }
      },
      contextMenus: {
        type: Array,
        default(){
          return [];
        },
        required: false
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
  @import "../scss/tree";
</style>
