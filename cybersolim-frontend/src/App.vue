<template>
  <div>
    <div v-if="$auth.ready()" id="app" class="container-fluid">
      <router-view></router-view>
    </div>
    <div v-if="!$auth.ready()" class="container-fluid">
      <p class="wait">Waiting for server response ......</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  @import './assets/scss/layout.scss';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .wait {
    text-align: center;
    margin-top: 25%;
    font-size: larger;
  }
</style>
