<!--
houzhiwei
2017/5/21 15:05
-->

<template>
  <transition name="slide-up">
    <div class="vue-toolbar" >
      <toolbar-item v-for="(item,index) in items"
                    :icon="item.icon"
                    :click="item.click"
                    :title="item.title"
                    :text="item.text"
                    :size="item.size"
                    :key="'item'+index">
      </toolbar-item>
    </div>
  </transition>
</template>

<script>
  import ToolbarItem from './ToolbarItem'

  export default {
    name: 'vue-toolbar',
    data(){
      return {}
    },
    components: { ToolbarItem },
    methods: {},
    props: {
      items: {
        type: Array,
        required: true,
        default(){
          return [
            {
              title: 'Create new',
              icon: 'ios-add-circle',
              size: 17,
              text: 'Create',
              click(){
                this.$Message.success('created!');
              }
            }
          ]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vue-toolbar {
    position: absolute;
    top: 0;
    right:0;
    width: 100%;
    padding: 2px;
    text-align: center;
    background-color: rgba(227, 233, 218, 0.3);
    box-shadow: 1px 1px 3px rgba(0, 126, 236, 0.99)
  }

  .toolbar-item {
    padding: 5px;
    display: inline-block;
    transition: background-color .3s ease-out;
    &:hover {
      cursor: pointer;
      background-color: #00afaf;
      color: white;
      border-radius: 2px;
      font-weight: 500;
      i {
        color: white !important;
      }
    }
    i {
      margin-right: 5px;
    }
  }
</style>
