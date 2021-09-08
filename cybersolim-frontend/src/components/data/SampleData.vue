<template>
  <j-panel :options="panelOptions" :show="show">

  </j-panel>
</template>

<script>
  import { mapState } from 'vuex'
  import JPanel from '../widgets/JSPanel'
  export default {
    name: '',
    data(){
      return {
        panelOptions: {
          headerTitle: 'User Profile',
          theme: 'primary',
          contentSize: {
            width: 600,
            height: 350
          },
          onclosed: this.closeThis
        }
      }
    },
    components: { JPanel },
    methods: {
      closeThis(){
        this.$store.dispatch('showUserProfile', false);
      }
    },
    computed: {
    }
  }
</script>

<style lang="scss">

</style>
