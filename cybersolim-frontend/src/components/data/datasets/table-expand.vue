<template>
  <div>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">Projection: </span>
        <span class="expand-value">{{ row.layerProjection }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">Nodata: </span>
        <span class="expand-value">{{ row.layerNodata }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">CellSize: </span>
        <span class="expand-value">{{ row.cellSize }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">Unit: </span>
        <span class="expand-value">{{ row.unit }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="6">
        <span class="expand-key">Top: </span>
        <span class="expand-value">{{ row.extentTop }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">Down: </span>
        <span class="expand-value">{{ row.extentDown }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">Left: </span>
        <span class="expand-value">{{ row.extentLeft }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">Right: </span>
        <span class="expand-value">{{ row.extentRight }}</span>
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
<style>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
