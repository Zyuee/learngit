<template>
  <div>
    <div class="legend_bottom" v-if="collapsedLegend" @click="showLegendBox">
      <button>
        <Icon type="ios-list-box-outline" size="25" title="Show layer legend"/>
      </button>
    </div>
    <div v-if="showLegend">
      <div class="legend_box">
      <span>
        <Icon type="md-close" size="25" @click="closeLegendBox"/>
      </span>
        <div v-if="showLegend">
          <h3>Legend</h3>
          <h4>layer: {{layerName}}</h4>
          <img :src="imgUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: "legend-control",
    data() {
      return {
        collapsedLegend: true,
        showLegend: false,
      };
    },
    methods: {
      showLegendBox(){
        this.showLegend = true;
        this.collapsedLegend = false;
      },
      closeLegendBox(){
        this.showLegend = false;
        this.collapsedLegend = true;
      },
    },
    computed: {
      ...mapState({
        imgUrl: state => state.currentLegendUrl,
        layerName: state => state.currentLegendName
      }),
    },
  }
</script>

<style scoped>
  .legend_bottom {
    position: absolute;
    width: 25px;
    height: 25px;
    bottom: 11px;
    right: 100px;
    background: rgba(229, 233, 230, 1);
  }
  .legend_box {
    position: absolute;
    width: 150px;
    height: 350px;
    bottom: 30px;
    right: 100px;
    background: rgba(240, 240, 240, 0.3);
  }
  h3 {
    color: rgba(1, 1, 1, 1);
    font-size: 18px;
    text-align: center;
    font-family: PingFangSC-regular;
    padding-top: 20px;
  }
  h4 {
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    text-align: center;
    font-family: PingFangSC-regular;
    padding-top: 5px;
  }
  img {
    width: 100px;
    height: 250px;
    margin: 15px auto 33px;
  }
  span {
    width: 25px;
    height: 25px;
    background-size: 25px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

</style>
