<!--
generated model structure
-->
<template>
  <j-panel :options="panelOptions" :show="show">
    <Table size="small" border :data="tblData" :columns="cols" height="200">
    </Table>
  </j-panel>
</template>

<script>
  import JPanel from '@/components/widgets/JSPanel'
  import {mapState} from 'vuex'

  export default {
    name: "ModelConfigure",
    data(){
      return {
        panelOptions: {
          headerTitle: 'SEIMS Model Structure',
          theme: 'primary',
          contentSize: {
            width: 750,
            height: 400
          },
          onclosed: this.closeThis,
          animateOut: 'jsPanelFadeOut',
          resizeit: false
        },
        tblData:[],
        cols:[]
      }
    },
    computed: {
      ...mapState({
        show: state => state.SeimsState.showSeimsModel,
      })
    }

  }
</script>

<style scoped>

</style>
