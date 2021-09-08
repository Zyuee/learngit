<template>
  <div class="layout">
    <Menu mode="horizontal"
            theme="light"
            active-name="1">
      <!--<div class="layout-logo">
        EasyGC
      </div>-->
      <div class="layout-logo-image">
        <img alt="EasyGC" style="vertical-align: middle;height: 40px;line-height: 60px;"
             src="@/assets/img/egc.jpg" align="middle"/>
      </div>
      <user-info></user-info>
    </Menu>
  </div>
</template>

<script>
  import UserInfo from '../user/UserInfo'
  export default {
    name: 'top-nav',
    components: {
       UserInfo
    }

  }
</script>

<style lang="scss" scoped>
  // 自定义样式，覆盖iview默认样式
  .layout {
    background: #f5f7f9;
  }
  .layout-logo-image {
    position: relative;
    float: left;
    margin-left: 1rem;
    text-align: left;
  }
  .layout-logo {
    background: transparent;
    border-radius: 3px;
    float: left;
    position: relative;
    left: 1rem;
    font-size: x-large;
    font-style: italic;
    font-family: fantasy;
    text-shadow: 1px 2px 3px rgba(139, 197, 159, 0.97);
    color: rgb(9, 41, 197)
  }

  .layout-nav {
    margin: 0 auto;
    position: absolute;
    right: 4rem;
  }

  .ivu-menu-horizontal {
    height: 3rem;
    line-height: 3rem;
    z-index: 100;
    /*box-shadow: 3px 3px 10px rgba(121, 120, 118, 0.69)*/
  }

  .ivu-menu-light {
    /*background-color: rgb(245, 247, 249)*/
  }

</style>
