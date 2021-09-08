<template>
  <sidebar :tabs="tabs">
    <projects slot="projects" @getSavedModelId="savedModelId"></projects>
    <datasets slot="datasets"></datasets>
    <models slot="models" ref="model"></models>
  </sidebar>
</template>

<script>
  import Sidebar from '../widgets/Sidebar'
  import Projects from './projects/ProjectsTree'
  import Datasets from './datasets/DatasetsTree.vue'
  import Models from './models/ModelsTree.vue'

  export default {
    name: 'data-sidebar',
    data(){
      return {
        tabs: [
          {
            //index=0
            id: 'datasets',
            icon: 'iconfont egc-icondatabase',
            title: 'DataSets'
          },
          {
            //index=1
            id: 'models',
            icon: "iconfont egc-iconmodel",
            title: "User's Models"
          },
          {
            //index=2
            id: 'projects',
            icon: 'ios-briefcase',
            title: 'Projects'
          }
          ]
      }
    },
    components: {Sidebar,Projects,Datasets,Models},
    methods:{
      savedModelId(modelId){
        //console.log(modelId)
        this.$refs.model.openModel(modelId);
      }
    }
  }
</script>
