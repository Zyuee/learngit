<!--
@author: houzhiwei
@date: 2018/6/3 22:06
-->

<template>
  <div>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key"></span>
        <span class="expand-value"></span>
      </Col>
    </Row>
  </div>
</template>

<script>

  export default {
    props: {
      row: Object
    }
  }
</script>
<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
