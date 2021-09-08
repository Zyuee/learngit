<template>
  <div style="width: 600px; margin-left: 2rem">
    <h3>Task{{index+1}}: </h3>
    <h4>&emsp;&emsp;TaskName: {{task.getSelectedAlgorithm().algorithmName}}</h4>
    <h4>&emsp;&emsp;InputData: </h4>
    <div v-for="inputDataItem in task.getSelectedAlgorithm().inputDatas">
      <p v-if="inputDataItem.value.length > 0">
        &emsp;&emsp;&emsp;{{inputDataItem.dataName+": " + inputDataItem.value[0]}}
      </p>
      <p v-else-if="inputDataItem.valueFromPreTask.length > 0">
        &emsp;&emsp;&emsp;{{inputDataItem.dataName+": " + inputDataItem.valueFromPreTask[0]}}
      </p>
      <p v-else style="color: red">
        &emsp;&emsp;&emsp;{{inputDataItem.dataName+": NULL"}}
      </p>
    </div>
    <h4>&emsp;&emsp;Parameter: </h4>
    <div v-for="parameterItem in task.getSelectedAlgorithm().parameters">
      <p v-if="parameterItem.value.length > 0 && parameterItem.value[0] != undefined">
        &emsp;&emsp;&emsp;{{parameterItem.parametername+": " + parameterItem.value[0]}}
      </p>
      <p v-else style="color: red">
        &emsp;&emsp;&emsp;{{parameterItem.parametername+": NULL"}}
      </p>
    </div>
    <h4>&emsp;&emsp;OutputData: </h4>
    <div v-for="outputDataItem in task.getSelectedAlgorithm().outputDatas">
      <p v-if="outputDataItem.value.length > 0">
        &emsp;&emsp;&emsp;&emsp;{{outputDataItem.dataName+": " + outputDataItem.value[0]}}
      </p>
      <p v-else-if="outputDataItem.valueFromPreTask.length > 0">
        &emsp;&emsp;&emsp;{{outputDataItem.dataName+": " + outputDataItem.valueFromPreTask[0]}}
      </p>
      <p v-else style="color: red">
        &emsp;&emsp;&emsp;{{outputDataItem.dataName+": NULL"}}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "task-info",
    data(){
      return {

      }
    },
    props: ['task', 'index']
  }
</script>

<style scoped>

</style>
