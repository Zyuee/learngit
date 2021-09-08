<template>
  <context-menu class="right-menu"
                :target="target"
                :show="menuVisible"
                @update:show="(show) => menuVisible = show">
    <a  @click="saveModel">saveModel</a>

  </context-menu>
</template>



<script>
  export default {
    data () {
      return {}
    },
    methods:{
      saveModel(){},
    },
    computed:{
      graphType(){
        return this.rMouseDownType.type;
      },
    },
    props:{
      target:{
        type:Object,
        required:true
      },
      menuVisible:{
        type:Boolean,
        required:true
      },
      manager:{
        type:Object,
        required:true
      },
      rMenuPosition:{
        type:MouseEvent,
        required:true
      },
      rMouseDownType:{
        type:Object,
        required:true
      }
    }
  }
</script>
<style>
  .right-menu {
    position: fixed;
    background: #fff;
    border: solid 1px rgba(0, 0, 0, .2);
    border-radius: 3px;
    z-index: 999;
    display: none;
  }
  .right-menu a {
    width: 150px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
  }
  .right-menu a:hover {
    background: #eee;
    color: #fff;
  }
  .right-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    border-radius: 1px;
  }
  a {
    text-decoration: none;
  }
  .right-menu a {
    padding: 2px;
  }
  .right-menu a:hover {
    background: #42b983;
  }
</style>
