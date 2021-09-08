<!--
houzhiwei
2017/6/21 11:29
-->

<template>
  <div id="bubbles">
    <bg-bubble></bg-bubble>
    <div class="txt">
      <p class="code">      404
      </p>
      <p>(⊙o⊙)</p>
      <p >
        Page Not Found
      </p>
      <router-link to="/" exact>
        Go to home page
      </router-link>
    </div>
  </div>
</template>

<script>
  import BgBubble from '../widgets/Bg-Bubble'

  export default {
    name: 'not-found',
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
