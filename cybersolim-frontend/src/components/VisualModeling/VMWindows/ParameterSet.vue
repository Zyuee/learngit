<template>
  <transition name="slide-up">
    <j-panel :options="panelOptions" :show="show" class="data-form">
      <Form ref="formDynamic" :model="formDynamic" :label-width="270" label-position="left">
        <Scroll height="200" loading-text="loading">
          <div style="width: 600px">
          <FormItem v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="item.index"
                    :label="item.label"
                    :prop="'items.' + index + '.value'"
                    :rules="{required: true, message: item.label +' can not be empty', trigger: 'blur'}">
            <Row>
              <Col>

              <!--<Select v-if="item.paraOption.length > 1" v-model="item.select">-->
                <!--<Option v-for="optionItem in item.paraOption" :value="optionItem" :key="optionItem">{{optionItem}}</Option>-->
              <!--</Select>-->
              <v-select v-if="item.paraOption.length > 1" v-model="item.value" :options="item.paraOption" maxHeight="100px"></v-select>
              <Input v-else="" type="text" v-model="item.value" placeholder="Enter the value"> </Input>
              </Col>
            </Row>

          </FormItem>
          </div>
        </Scroll>

        <Row align="middle" style="margin-top: 10px">
          <Button icon="md-checkmark" type="primary" @click="handleSubmit('formDynamic')">Ok</Button>
          <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Row>

      </Form>

    </j-panel>
  </transition>
</template>
<!--下面语句是前版本的设置，select对应的是多选项的参数，value对应的是用户输入的参数。现全用value作为记录-->
<!--:prop="item.paraOption.length > 1 ? 'items.' + index + '.select' : 'items.' + index + '.value'"-->
<script>
  import JPanel from '../../widgets/JSPanel'
  import { vIziToast } from '../../../js/notify/v-iziToast'
  import { mapState } from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import Knowledge from '../../knowledge/Knowledge_new'
  import Parameter from '../model/Parameter'
  import {modelingConst} from '../../constVariable'
  import vSelect from 'vue-select'
  export default {
    name: 'parameters_select',
    data () {
      return {
        panelOptions: {
          id: 'parameters_select_window',
          paneltype: 'modal',
          theme: 'success',
          headerTitle: 'Select algorithm parameters',
          show: 'animated bounceInDown',
          draggable: true,
          contentSize: {
            width: 600,
            height: 260
          },
          position: {
            my: 'center',
            at: 'center'
          },
          onclosed: this.closeThis
        },
        formDynamic: {
          items: []
        },
        fields:[],
        params:{},
      }
    },
    components: {JPanel, vSelect},
    methods: {
      closeThis () {
        this.$store.dispatch(actionTypes.SHOW_PARA_WINDOW, false)
      },

      async checkEnvTypes(){
        let envNames = this.graphManager.checkEnvs();
        let envTypeResponse = await this.axios.get('./semantic/getSemanticType?semanticNames='+envNames);
        let envTypeData = envTypeResponse.data.data;
        let envRules = "";
        for (let i = 0; i < envNames.length; i++){
          if (envRules === ""){
            envRules = envTypeData[i];
          }else {
            envRules = envRules + modelingConst.PATHSPLIT  + envTypeData[i];
          }
        }
        return [envRules];
      },
      async getFormData () {
        let items = [];
        const paramsResponse = await this.axios.get('./algorithm/findAlgorithmParameter?serviceName=' + this.currentTask.taskName);
        let params = paramsResponse.data.data;
        // console.log(params);
        for (let i = 0; i < params.length; i++) {
          // if (params[i].parameterName === modelingConst.ENVRULES) continue;
          let item = {};
          console.log(params[i].parameterName);
          let selectItem = this.$store.getters.getSelectedItem(params[i].parameterName);
          if ("MinViewRange" === params[i].parameterName || "MaxViewRange" === params[i].parameterName){
            params[i].parameterName += '(/meter)'
          }
          if (selectItem.length > 0) {//如果存在设置的值，则直接使用
            if (selectItem[0].value != undefined) {
              item.value = selectItem[0].value;
            } else {
              item.value = '';
            }
            //如果参数是有多选择的，则添加
            if (params[i].parameterValue.length > 1) {
              item.paraOption = params[i].parameterValue;
            } else {
              item.paraOption = [];
            }
          } else {
            if (params[i].parameterValue.length > 1) {
              item.value = params[i].parameterValue[0];
              item.paraOption = params[i].parameterValue;
            } else if (params[i].parameterValue.length === 1) {
              item.value = params[i].parameterValue[0];
              item.paraOption = [];
            } else if (params[i].parameterValue.length === 0) {
              item.value = '';
              item.paraOption = [];
            }
          }
          let temptLabel = params[i].parameterName.split("_");
          item.label = '';
          for (let j = 0; j < temptLabel.length; j++) {
            item.label = item.label + temptLabel[j];
          }
          item.index = i
          item.status = 1
          // item.select = ''
          items.push(item);
        }
        this.formDynamic.items = items
        console.log(this.formDynamic.items)
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let AlgorithmParameters = [];
            let paras = this.formDynamic.items;
            for(let i = 0; i < paras.length; i++){
              let paramName = paras[i].label;
              //临时做法，去除单位显示
              let trimIndex = paras[i].label.indexOf('(/meter)');
              if (trimIndex > -1){
                paramName = paras[i].label.substring(0, trimIndex);
              }
              let parameter = new Parameter(paramName);
              let temp = [];
              temp.push(paras[i].value);
              parameter.setValue(temp);
              AlgorithmParameters.push(parameter);
              if ("value" in paras[i] && paras[i].value.length > 0){
                this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: paramName, value: paras[i].value});//保存填写的参数项内容
              }
              //this.currentTask.setParameters(AlgorithmParameters);
            }
            let task = this.currentTask;
            let taskList = this.graphManager.list;
            for (let i = 0; i < taskList.length; i++){
              if (taskList[i] === task){
                taskList[i].setParameters(AlgorithmParameters);
              }
            }
            this.graphManager.reDraw(taskList);
            this.closeThis();
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!')
          }
        })
      },

    },
    watch: {
      show: function () {
        if (this.show){
          this.getFormData();
        }
      }
    },
    computed: {
      ...mapState({
        show: state => state.ModelState.showParaWindow,
        graphManager: state => state.ModelState.graphMangerState,
        layerId:state => state.DataState.layerId,
      })
    },
    props: {
      currentTask: null
    },

  }
</script>

<style scoped>
  .data-form {
    text-align: center;
    padding: 10px;
  }
</style>
