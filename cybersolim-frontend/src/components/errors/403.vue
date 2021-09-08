<!--
houzhiwei
2017/6/21 11:27
-->

<template>
  <div id="bubbles">
    <bg-bubble></bg-bubble>
    <div class="txt">
      <p class="code"> 403  </p>
      <p >
       No Access Permission
      </p>
    </div>

  </div>
</template>

<script>
  import BgBubble from '../widgets/Bg-Bubble'

  export default {
    name: 'forbidden',
    data(){
      return {}
    },
    components: {BgBubble},
    methods: {},
    computed: {}
  }
</script>

<style lang="scss" scoped>
  @import "error";
</style>
