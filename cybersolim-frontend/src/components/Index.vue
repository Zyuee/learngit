<template>
  <div class="index">
    <top-nav></top-nav>
    <!--basemap 必须在其他使用map对象的组件之前-->
    <base-map></base-map>
    <!--page widgets-->
    <data-sidebar></data-sidebar>
    <search-box></search-box>
    <map-toolbar></map-toolbar>
    <legend-control></legend-control>
  </div>

</template>
<script>
  // 基础地图组件
  import BaseMap from './map/BaseMap'
  import SearchBox from './map/MapSearchBox'
  import MapToolbar from './map/MapToolbar'
  // 顶部导航
  import TopNav from './widgets/TopNav'
  import DataSidebar from './data/DataSidebar'
  import LegendControl from './map/LegendControl'

  export default {
    data(){
      return {
      }
    },
    components: {
      BaseMap, SearchBox, MapToolbar, DataSidebar, TopNav, LegendControl
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  .index{
    // 必须设置为 100vh，即整个可视区域的高度，否则 拖动 jspanel 时会出现面板消失的问题
    height: 100vh;
  }
</style>
