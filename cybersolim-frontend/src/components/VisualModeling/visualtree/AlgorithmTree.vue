<template>
  <div class="algorithm-tree">
    <ul>
      <tree-item :tree-node.sync="option.data">
      </tree-item>
    </ul>
  </div>
</template>

<script>
  import algorithmTreeItem from './AlgorithmTreeItem'
  //import TreeItem from '../../widgets/tree/TreeItem.vue'
  export default {
    name: 'algorithm-tree',
    data() {
      return {}
    },
    components: {
      'tree-item': algorithmTreeItem
    },
    methods: {},
    props: {
      option: {
        type: Object,
        required: true,
        default() {
          return {
            data: {
              name: 'Tree root name',
              title: 'Tree root title',
              isParent: true,
              rootNode: false,
              children: [],
              icon: 'ios-folder',
              openedIcon: 'ios-folder-open',
              closedIcon: 'ios-folder',
              showLoading: false,
              button: [
                {
                  title: 'root btn',
                  icon: 'ios-locate',
                  click: node => {
                    console.log('clicked tree root');
                  }
                }
              ],
              onOpened: node => {
                console.log('onOpened');
              },
              onClosed: node => {
                console.log('onClosed');
              }
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./algorithmtree.scss";

  /*@import "../../widgets/tree/tree.scss";*/
</style>
