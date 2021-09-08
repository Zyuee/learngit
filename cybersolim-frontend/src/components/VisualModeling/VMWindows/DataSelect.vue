<template>
  <div>
    <j-panel :options="panelOptions" :show="show" class="data-form">
      <div>
        <Table size="small" :data="tblData" :columns="cols"
               border  height="255"
               no-data-text="No-Data">
        </Table>

      </div>
      <Row align="middle">
        <Button icon="md-checkmark" type="primary" @click="handleSubmit()">Ok</Button>
        <Button icon="md-close" @click="closeThis">Cancel</Button>
      </Row>
    </j-panel>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import JPanel from '../../widgets/JSPanel'
  import expandRow from '../../data/datasets/table-expand.vue'
  import Data from '../model/Data'
  import {modelingConst} from '../../constVariable'
  import { vIziToast } from '@/js/notify/v-iziToast'
  export default {
    name: 'select_data',
    data(){
      return {
        panelOptions: {
          id: 'data_select',
          theme: 'primary',//"#0074D9",
          paneltype: 'modal',
          headerTitle: 'select single-data',
          draggable: true,
          contentSize: {
            width: 670,
            height: 300
          },
          onclosed: this.closeThis
        },
        cols: [
          {
            align:'center',
            key: 'checkBox',
            render:(h,params)=>{
              return h('div',[
                h('Checkbox',{
                  props:{
                    value:params.row.checkBox
                  },
                  on:{
                    'on-change':(e)=>{
                      if (this.isSingleSelect){
                        this.tblData.forEach((items)=>{      //先取消所有对象的勾选，checkBox设置为false
                          this.$set(items,'checkBox',false)
                        });
                      }
                      this.tblData[params.index].checkBox = e;  //再将勾选的对象的checkBox设置为true
                    }
                  }
                })
              ])
            }
          },
          {
            title: 'name',
            key: 'layerName',
            width: 150,
            sortable: true,
            align: 'center'
          },{
            title: 'dataSetName',
            key:'dataSetName',
            width: 150,
            sortable: true,
            align: 'center'
          },
          {
            title: 'property',//是一个选择器
            key: 'property',
            width: 110,
            align: 'center',
            render:(h, params) =>{
              return h('Select', {
                props:{
                  transfer: true,
                  value: (this.$store.getters.getSelectedItem(params.row.layerName).length != 0 ? this.$store.getters.getSelectedItem(params.row.layerName)[0].value : '')
                },
                on:{
                  'on-change':(e)=>{//选择一个值后触发
                    this.tblData[params.index].selectProperty = e;
                    this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: params.row.layerName, value: this.tblData[params.index].selectProperty});
                  }
                }
              }, this.tblData[params.index].property.map((item) =>{
                return h('Option',{
                  props:{
                    value: item,
                    label: item
                  }
                })
              }))
            }
          },
          {
            title: 'format',
            width: 100,
            key: 'layerFormat',
            align: 'center'
          },
          {
            title:'more',
            type: 'expand',
            width: 70,
            align: 'center',
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          ],
        dataSemantic:'',
        tblData: [],
        dataFilePath:[],
        isSingleSelect: true,//add by yrx 20200820
        selectedItem:[],
      }
    },
    components: { JPanel, expandRow},
    methods: {
      closeThis () {
        this.$store.dispatch(actionTypes.SHOW_DATA_WINDOW, false)
      },
      showDatalayerInfo(){
        let callDataUrl = "";
        //todo 构建模型时，setData过程中this.currentData.dataFormat是个数组；复现模型时，setData过程中this.currentData.dataFormat是个字符串值，因此加了个判断，否则复现模型无法setData
        for (let i = 0; i < this.currentData.dataFormat.length; i++) {
          switch (this.currentData.dataFormat[i]) {
            case "Vector":
              callDataUrl = "/dataSet/getSemanticVector?semantic=" + this.currentData.dataName + "&areaExtent=" + this.mappingArea;
              break;
            case "Raster":
              callDataUrl = "/dataSet/getSemanticRaster?semantic=" + this.currentData.dataName + "&areaExtent=" + this.mappingArea;
              break;
            case "Table":
              callDataUrl = "/dataSet/getUserSampleTable?semantic=" + this.currentData.dataName + "&areaExtent=" + this.mappingArea;
              break;
            case "Other":
              break;
          }
          if (this.show) {
            this.axios({
              url: callDataUrl,
              method: 'get',
              // params:{semantic: this.currentData.dataName, areaExtent:this.mappingArea}
            }).then(response => {
              if (response.data.data != null && response.data.data.length !== 0) {
                //console.log(response);
                this.tblData.push(...response.data.data);//利用扩展运算符将多个数据来源综合成一个
                for (let i = 0; i < this.selectedItem.length; i++) {//复现之前选择的选项
                  let index = this.selectedItem[i];
                  this.tblData[index].checkBox = true;
                }
              }
            })
          } else {
            this.tblData = [];//关闭的时候，清空数组
          }
        }
      },

      //思想是尽量少于后台交互，所以找到工作流中的推测算法是挖掘图形工作流中的相互关系
      handleSubmit(){
        this.dataFilePath = [];
        let selectItemIndex = [];
        for (let i = 0; i < this.tblData.length; i++){
          if (this.tblData[i].checkBox === true){
            if (this.tblData[i].selectProperty == undefined){
              this.tblData[i].selectProperty = (this.$store.getters.getSelectedItem(this.tblData[i].layerName).length != 0 ? this.$store.getters.getSelectedItem(this.tblData[i].layerName)[0].value : undefined)
            }
            this.dataFilePath.push(this.tblData[i].filePath);
            selectItemIndex.push(i);

            this.$store.dispatch(actionTypes.SHOW_LAYER_ID, this.tblData[i].dataLayerId);
            if (this.currentData.dataFormat.includes('Table')){//记录选择的是哪个表格，用于查找里面的字段
              // this.$store.dispatch(actionTypes.SELECT_SAMPLE_PROPERTY, this.tblData[i].selectProperty);
              this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: 'SoilPropertyField', value: this.tblData[i].selectProperty});
              if(this.graphManager.checkHasSoilSample()){//当设置完样点属性后，立刻更新到主体任务中，否则无法通过check
                this.graphManager.setSoilSampleProperty([this.tblData[i].selectProperty]);
              }
            }
          }
        }
        for (let i =0; i< this.graphManager.list.length; i++){
          if (this.graphManager.list[i] === this.currentData){
            this.graphManager.list[i].setValue(this.dataFilePath);
            this.graphManager.list[i].check();//将hasValue进行刷新
          }
        }
        this.graphManager.reDraw(this.graphManager.list);
        // this.graphManager.writeEnvsValues();
        // let isDone = this.checkInputDataHasSetValue();//检查父级任务的输入数据是否都设置好了
        // if (isDone){
        //   //提醒用户设置任务参数，显示事件3秒
        //   vIziToast.holdOn("Please set the algorithm parameters...");
        //   let toast = document.querySelector('.iziToast');
        //   setTimeout(function (){
        //     vIziToast.hide(toast);
        //   }, 3000);
        // }
        this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: this.currentData.dataName, value: selectItemIndex});
        this.closeThis();
        this.graphManager.reDraw(this.graphManager.list);
      },
      checkInputDataHasSetValue(){
        let taskResult = this.graphManager.checkInputDataTask(this.currentData);
        if(taskResult.flag){
          // taskResult.inputTask.check();//检查任务是否可行
          let isDone = true;
          let faterTask = taskResult.inputTask;
          let inputDatas = faterTask.getInpuDatas();//父级算法所输入的数据
          let outputDatas = faterTask.getOutputDatas();//父级算法所输出的数据
          for(let i = 0; i < inputDatas.length; i++){
            if(!inputDatas[i].hasValue){
              isDone = false;
            }
          }
          for(let i = 0; i < outputDatas.length; i++){
            if (isDone){
              //检查该outputData的输出格式，默认选择第一种输出格式，其中other类型不添加后缀，在后台利用完删除
              let suffix = '';
              switch(outputDatas[i].dataFormat[0]){
                case "Vector":
                  suffix = '.shp';
                  break;
                case "Raster":
                  suffix = '.tif';
                  break;
                case "Table":
                  suffix = '.csv';
                  break;
                case "Other":
                  suffix = '';
                  break;
              }
              //根据输入的数据预设输出数据的名字
              let value = [];
              let nowtime = (new Date()).valueOf();
              let filename = "result_egc/" + outputDatas[i].dataName + nowtime + suffix;//需要设置输出结果的后缀
              filename = filename.replace(/\s/g,"");
              value.push(filename);
              outputDatas[i].setValueFromPreTask(value);
              faterTask.isReadyToRun = true;//设置该任务可以运行了
              this.recruitCheckTaskIsReadyRun(outputDatas[i]);//递归检查
            }else{
              outputDatas[i].setValueFromPreTask([]);
              faterTask.isReadyToRun = false;
            }
            outputDatas[i].check();
          }
          return isDone;
        }
      },
      recruitCheckTaskIsReadyRun(data){
        let inputTaskResult = this.graphManager.checkInputDataTask(data);//查找将本输出数据作为输入数据的任务
        if(inputTaskResult.flag){
          inputTaskResult.inputTask.check();
          let outputDatas = inputTaskResult.inputTask.selectedAlgorithm.outputDatas;
          for(let i = 0; i < outputDatas.length; i++){
            this.recruitCheckTaskIsReadyRun(outputDatas[i]);
          }
        }
      }
    },
    watch:{
      show:function () {
        //监视标题、多选与单选
        this.$data.panelOptions.headerTitle = this.mHeaderTitle;
        this.$data.isSingleSelect = this.mIsSingleSelectType;
        let selectItems = this.$store.getters.getSelectedItem(this.currentData.dataName);
        if (selectItems.length > 0){
          this.$data.selectedItem = selectItems[0].value;
        }else {
          this.$data.selectedItem = [];
        }
        this.showDatalayerInfo();
      },

    },
    computed: {
      ...mapState({
        show: state => state.ModelState.showDataWindow,
        graphManager: state => state.ModelState.graphMangerState,
        mappingArea: state => state.MapState.clickGeometry,
        mHeaderTitle: state => state.ModelState.headerTitle,
        mIsSingleSelectType: state => state.ModelState.isSingleSelectType,
      })
    },
    props:{
      currentData:null
    }
  }
</script>

<style lang="scss" scoped>
  .data-form {
    text-align: center;
    padding: 10px;
  }
</style>
