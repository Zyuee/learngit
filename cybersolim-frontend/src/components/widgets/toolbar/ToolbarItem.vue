<!--
houzhiwei
2017/5/21 16:31
Note: scss defined in toolbar.vue
-->

<template>
    <div class="toolbar-item" :title="title" @click="itemClick(click)">
      <Icon :type="icon" :size="size" :color="color"></Icon> {{ text }}
    </div>
</template>

<script>

  export default {
    name: 'toolbar-item',
    data(){
      return {}
    },
    methods: {
      itemClick: click => {
        if (typeof click==='function') {
          click();// 必须带括号()才能执行
        }
      }
    },
    props: {
      title: {
        type: String,
        default: 'toolbar item'
      },
      icon: {
        type: String,
        required: true,
        default: 'wrench'
      },
      size: {
        type: [Number, String],
        default: 16
      },
      color: {
        type: String
      },
      text: {
        type: String,
        default: ''
      },
      click: {
        type: Function,
        required: true,
        default(){
          return function() {
            this.$Message.info('Toolbar item clicked!');
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
