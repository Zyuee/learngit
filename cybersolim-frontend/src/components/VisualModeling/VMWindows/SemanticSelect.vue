<template>
  <transition name="slide-up">
    <j-panel :options="panelOption" :show="show" class="data-form">
      <row>
        <Transfer :data="semanticOption"
                  :target-keys="selected"
                  :render-format="renderEnvs"
                  @on-change="handleChange"
                  filterable
                  :filter-method="filterMethod"
                  :titles="TransferTitle"
                  :list-style="listStyle">
        </Transfer>
      </row>
      <row>
        <Col>
        <!--<Button icon="md-checkmark" type="primary" @click="saveSemantics">Create</Button>-->
        <Button icon="md-checkmark" type="primary" @click="saveSemanticsOperater">Create</Button>
        <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Col>
      </row>

        <!--<FormItem>-->
          <!--<v-select multiple clearSearchOnSelect taggable transition-->
                    <!--label="semanticsName"-->
                    <!--:options="semanticOption"-->
                    <!--:value.sync="selected"></v-select>-->
        <!--</FormItem>-->
    </j-panel>
  </transition>
</template>

<script>
  import JPanel from '../../widgets/JSPanel'
  import { vIziToast } from '../../../js/notify/v-iziToast'
  import {mapState, mapGetters} from 'vuex'
  import * as actionTypes from '../../../store/action-types'
  import VSelect from 'vue-select'
  import data from '../model/Data'
  import task from '../model/Task';
  import connection from '../model/Connection'
  import {modelingConst} from '../../constVariable'
  import KnowledgeBase from '../../knowledge/Knowledge_new';
  export default {
    name: 'semantic_select',
    data() {
      return {
        panelOption: {
          id: 'semantic_select_window',
          paneltype: 'modal',
          theme: "success",
          headerTitle:'',//yrx
          draggable: true,
          contentSize: {
            width: 550,
            height: 260
          },
          onclosed: this.closeThis,
        },
        TransferTitle:'',//yrx
        listStyle:{'text-align': 'left', 'width': '220px'},
        selected:[],
        oldSelected:[],
        semantics:[],
        semanticOption:[],
        dataSemantics: [],
      }
    },
    components: { JPanel, VSelect},
    methods: {
      closeThis(){
        this.$store.dispatch(actionTypes.SHOW_ENV_WINDOW, false);
        this.semanticOption=[];
      },
      getData(show){
        if (show){
          let layers = this.basemap.getLayers().getArray();
          let topLayer = null;
          for (let i = layers.length-1; i >=0; i--){
            //获取顶层显示的图层，需要过滤基础图层
            if (layers[i].get('name') !== undefined && layers[i].get('name') !== 'baseVectorLyr' && layers[i].getVisible()){
              topLayer = layers[i];
              break;
            }
          }
          this.axios({
            // url: '/semantic/listAllSample',
            url: this.mDataURL,
            method: 'get',
            params: {
              topLayerPath: topLayer.get("name")
            }
          }).then(response => {
            //this.dataSemantics = response.data.data;
            let temp = response.data.data;
            if ("/semantic/listAllEnv" == this.mDataURL){
              for(let i = 0; i< temp.length; i ++){
                let tempObject = {};
                tempObject.key = temp[i].semanticsId;
                tempObject.label = temp[i].semanticsName;
                tempObject.canDerive = temp[i].canDerive;
                this.semanticOption.push(tempObject);
              }
            } else{
              for(let i = 0; i< temp.length; i ++){
                let tempObject = {};
                tempObject.key = temp[i].sampleSemanticId;
                tempObject.label = temp[i].sampleSemanticName;
                tempObject.canDerive = 0;//对于样本而言，默认为不可派生
                this.semanticOption.push(tempObject);
              }
            }
            //this.semanticOption = this.semantics;
          }).catch(err => {
            console.log(err)
          })
        }
      },
      getElementByName(elementName){//获取当前选择的元素
        let elements = this.graphManager.list;
        let mElement =  null;
        for (let i=0;i < elements.length; i++){
          if (elements[i].dataName === elementName){
            mElement = elements[i];
            break;
          }
        }
        return mElement;
      },
      async setCheckOrIntegrateMethod(currentSelectedElement,checkHasFatherTaskResult, newDataAddOnLeftSide){
        let currentIntegrationTask = checkHasFatherTaskResult.fatherTask;
        //如果当前没有综合方法，则从后台搜索，补充一个样本综合方法
        if (!checkHasFatherTaskResult.flag){
          let kb = new KnowledgeBase();
          let taskName = null;
          let outputNames = [];
          let parameterNames = [];
          vIziToast.holdOn("searching check data algorithm, please hold on");
          await kb.findTaskNameHasOutput(this.mCurrentSelectedElementName, function (response) {
            let tasks = response.data;
            tasks.forEach(function (task) {
              taskName = task.algorithmName;
              let interfaces = task.algorithmInterfaceList;
              parameterNames = task.algorithmParameterList;
              interfaces.forEach(function (algorithmInterface) {
                if(!algorithmInterface.input && algorithmInterface.output){
                  outputNames.push(algorithmInterface.name)
                }
              })
            })
          })
          let toast = document.querySelector('.iziToast');
          if(taskName===null){
            vIziToast.hide(toast);
            return;
          }
          vIziToast.hide(toast);
          let newTask = new task(currentSelectedElement.x + 1,currentSelectedElement.y - 70,100,50,taskName,this.graphManager.canvas,this.graphManager);
          newTask.initAlgorithms();
          newTask.setDefaultAlgorithm();
          currentSelectedElement.setValueFromPreTask([]);
          newTask.setOutputDatas([currentSelectedElement]);
          this.graphManager.list.push(newTask);
          let con = new connection(newTask, currentSelectedElement, this.graphManager.canvas);
          this.graphManager.list.push(con);
          currentIntegrationTask = newTask;
          //综合任务的下个任务是主任务
          let inputDataTaskResult = this.graphManager.checkInputDataTask(currentSelectedElement);
          if(inputDataTaskResult.flag){
            currentIntegrationTask.addNextTask(inputDataTaskResult.inputTask);
          }
        }
        if(currentIntegrationTask !== null){
          if(this.mCurrentSelectedElementName === 'Covariates'){
            this.saveOperater(currentSelectedElement, currentIntegrationTask, newDataAddOnLeftSide, ["Raster"]);
          }else {
            this.saveOperater(currentSelectedElement, currentIntegrationTask, newDataAddOnLeftSide, ["Table", "Vector"]);
          }
        }else {
          //提示用户无法融合样点
        }
      },

      saveOperater(currentSelectedElement, currentTask, newDataAddOnLeftSide, dataFormat){
        let elements = this.graphManager.list;
        //获取选择环境变量的名称
        let selectEnvs = [];
        let selectIndexArray = this.selected;
        //如果没有输入元素，则直接删除预处理任务
        if(selectIndexArray.length === 0){
          currentSelectedElement.setValueFromPreTask([]);
          this.graphManager.deleteTask(currentTask);
          this.graphManager.reDraw(this.graphManager.list);//重绘canvas
          this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: this.mCurrentSelectedElementName, value: this.selected});
          this.closeThis();
          return;
        }
        //判断哪些因子保留，哪些因子删除
        let theItemWillDelete = [];
        let theItemWillAdd = [];
        for (let i = 0; i < selectIndexArray.length; i++){
          if(this.oldSelected.indexOf(selectIndexArray[i])===-1) {
            theItemWillAdd.push(selectIndexArray[i]);
          }
        }
        for (let i = 0; i < this.oldSelected.length; i++){
          if(selectIndexArray.indexOf(this.oldSelected[i])===-1) {
            theItemWillDelete.push(this.oldSelected[i]);
          }
        }
        let theSemanticWillDelete = [];
        let theSemanticWillAdd = [];
        //获取将要被新增的因子
        this.semanticOption.forEach(function (item) {
          if(theItemWillAdd.indexOf(item.key) > -1){
            theSemanticWillAdd.push({label: item.label, canDerive: item.canDerive});
          }
        });
        //获取将要被删除的因子
        this.semanticOption.forEach(function (item) {
          if(theItemWillDelete.indexOf(item.key) > -1){
            theSemanticWillDelete.push(item.label);
          }
        });
        //获取所有选择的因子
        this.semanticOption.forEach(function (item) {
          if(selectIndexArray.indexOf(item.key) > -1){
            selectEnvs.push(item.label);
          }
        });
        //判断选择的环境变量是否已经存在
        let inputDataBeforeCreating = currentTask.getSelectedAlgorithm().inputDatas;//当前算法所输入的数据
        let theDataWillDelete = [];
        for (let i = 0; i < inputDataBeforeCreating.length; i++){
          if(theSemanticWillDelete.indexOf(inputDataBeforeCreating[i].dataName) !== -1){
            theDataWillDelete.push(inputDataBeforeCreating[i]);
          }
        }
        //删除
        for (let i = 0; i < theDataWillDelete.length; i++){
          this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: theDataWillDelete[i].dataName, value: []});//删除的元素要清空选择
          let index = inputDataBeforeCreating.indexOf(theDataWillDelete[i]);
          if (index > -1){
            inputDataBeforeCreating.splice(index, 1);
          }
        }
        //删除环境变量与环境协变量管理器之间的连接线
        let theConnectionWillDelete = [];
        for(let i = 0; i < theDataWillDelete.length; i++){
          for (let j = 0; j < elements.length; j++){
            if (elements[j].type === 'arrow'){
              if (elements[j].start === theDataWillDelete[i] && elements[j].end === currentTask){
                theConnectionWillDelete.push(elements[j]);
              }
            }
          }
        }
        //删除与删除对象的父节点
        let theElementWillDelete = [];
        for (let i = 0; i < theDataWillDelete.length; i++){
          let count = 0;
          for (let j = 0; j < elements.length; j++){
            if (elements[j].type==='rectangle'){
              if(elements[j].hasInputData(theDataWillDelete[i])){
                count++;
              }
            }
          }
          if (count < 2){
            theElementWillDelete.push(theDataWillDelete[i]);
            for (let j = 0; j < elements.length; j++){
              if (elements[j].type === 'rectangle'){
                if(elements[j].hasOutputData(theDataWillDelete[i])){
                  // this.graphManager.deleteGraph(elements[j]);
                  this.graphManager.deleteTask(elements[j]);
                }
              }
            }

          }else if (count >= 2){
            for (let j = 0; j < elements.length; j++){
              if (elements[j].hasOutputData(theDataWillDelete[i])){
                elements[j].deleteNextTask(currentTask);
              }
            }
          }
        }
        let theElementWillDelete1 = [];
        theElementWillDelete1 = theElementWillDelete.concat(theConnectionWillDelete);
        //新增元素
        let theDataWillAdd = [];
        for (let i = 0; i < theSemanticWillAdd.length; i++){
          let newData = null;
          if (newDataAddOnLeftSide){
            newData = new data(currentTask.x - 150, currentTask.y + i * 60, 40, 25, theSemanticWillAdd[i].label, theSemanticWillAdd[i].canDerive, dataFormat, this.graphManager.canvas);
          }else {
            newData = new data(currentTask.x + 150, currentTask.y + i * 60, 40, 25, theSemanticWillAdd[i].label, theSemanticWillAdd[i].canDerive, dataFormat, this.graphManager.canvas);
          }
          newData.hasValue = false;
          theDataWillAdd.push(newData);
          inputDataBeforeCreating.splice(-1, 0, newData);//插入现有的输入数据列表中
        }
        currentTask.setInputDatas(inputDataBeforeCreating);//更新输入的数据

        let theConnectionWillAdd = [];
        for (let i = 0; i < theDataWillAdd.length; i++){
          let con = new connection(theDataWillAdd[i], currentTask, this.graphManager.canvas);
          theConnectionWillAdd.push(con);
        }
        let theElementWillAdd = [];
        theElementWillAdd = theDataWillAdd.concat(theConnectionWillAdd);

        for (let i = 0; i < theElementWillDelete1.length; i++){
          let index = this.graphManager.list.indexOf(theElementWillDelete1[i]);
          if (index !== -1){
            this.graphManager.list.splice(index, 1);
          }
        }
        for (let i = 0; i < theElementWillAdd.length; i++){
          this.graphManager.list.splice(-1, 0, theElementWillAdd[i]);
        }
        //重新对因子的显示位置进行排序
        for (let i = 0; i < selectEnvs.length; i++){
          this.graphManager.list.forEach(function (item) {
            if(item.dataName ===  selectEnvs[i]){
              item.y = currentTask.y + i * 60;
            }
          });
        }
        this.graphManager.reDraw(this.graphManager.list);//重绘canvas
        //保存选择的那一项
        this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: this.mCurrentSelectedElementName, value: this.selected});
        this.closeThis();
        this.$store.dispatch(actionTypes.SELECT_COVARIATE,selectEnvs);
        this.$store.dispatch(actionTypes.FINISH_COVARIATE,true);
      },

      saveSemanticsOperater(){
        let mCurrentSelectedElement = this.getElementByName(this.mCurrentSelectedElementName);
        let elementInputTask = this.graphManager.checkInputDataTask(mCurrentSelectedElement).inputTask;
        let isAddOnLeftSide = true;
        if (mCurrentSelectedElement.x > elementInputTask.x) {
          isAddOnLeftSide = false;
        }
        let mCheckHasFatherTaskResult = null;
        mCheckHasFatherTaskResult = this.graphManager.checkDataHasFatherTask(mCurrentSelectedElement);
        this.setCheckOrIntegrateMethod(mCurrentSelectedElement, mCheckHasFatherTaskResult, isAddOnLeftSide);

        // if (this.mCurrentSelectedElementName === modelingConst.HSM_SAMPLENAME){
        //   mCheckHasFatherTaskResult = this.graphManager.checkDataHasFatherTask(mCurrentSelectedElement);
        //   this.setSampleIntegration(mCurrentSelectedElement, mCheckHasFatherTaskResult, isAddOnLeftSide);
        // }else if (this.mCurrentSelectedElementName === modelingConst.HSM_ENVIRONMENTNAME || this.mCurrentSelectedElementName === modelingConst.SOILENVIRONMENT){
        //   mCheckHasFatherTaskResult = this.graphManager.checkDataHasFatherTask(mCurrentSelectedElement);
        //   this.setEnvLayerCheck(mCurrentSelectedElement, mCheckHasFatherTaskResult, isAddOnLeftSide);
        // }
      },
      //when user select envs, the collections he newly select may be different with the elements which have already
      // in the canvas, so this bring us two results. the first the newly select env not exists in the canvas,
      // we should add those envs into the canvas; the second is that the newly selecting has already exist in the canvas
      // we should delete this elements and the upriver elements.
      saveSemantics(){
        //first we examine the the existing elements
        let elements = this.graphManager.list;
        //获取选择环境变量的名称
        let selectEnvs = [];
        let selectIndexArray = this.selected;

        //判断哪些因子保留，哪些因子删除
        let theItemWillDelete = [];
        let theItemWillAdd = [];
        for (let i = 0; i < selectIndexArray.length; i++){
          if(this.oldSelected.indexOf(selectIndexArray[i])===-1) {
            theItemWillAdd.push(selectIndexArray[i]);
          }
        }
        for (let i = 0; i < this.oldSelected.length; i++){
          if(selectIndexArray.indexOf(this.oldSelected[i])===-1) {
            theItemWillDelete.push(this.oldSelected[i]);
          }
        }
        let theSemanticWillDelete = [];
        let theSemanticWillAdd = [];
        this.semanticOption.forEach(function (item) {
          if(theItemWillAdd.indexOf(item.key) > -1){
            theSemanticWillAdd.push(item.label);
          }
        });
        this.semanticOption.forEach(function (item) {
          if(theItemWillDelete.indexOf(item.key) > -1){
            theSemanticWillDelete.push(item.label);
          }
        });
        //获取所有选择的因子
        this.semanticOption.forEach(function (item) {
          if(selectIndexArray.indexOf(item.key) > -1){
            selectEnvs.push(item.label);
          }
        });
        //找到右键数据对应的任务
        let currentTask = null;
        let currentSelectedElement =  null;//用于判断新增的因子放在当前任务的左侧还是右侧
        for (let i=0;i < elements.length; i++){
          if (elements[i].type==="rectangle"){
            let flag = false;
            let datas = elements[i].getSelectedAlgorithm().inputDatas;
            //判断是否为需要环境变量的数字土壤制图算法
            for (let j = 0; j < datas.length; j++){
              if (datas[j].dataName === modelingConst.SOILENVIRONMENT || datas[j].dataName === 'HSM_Samples'){
                flag = true;
              }
            }
            if (datas.indexOf(this.modelingEnvs) && flag){
              currentTask = elements[i];
            }
          }
          if (elements[i].dataName === this.mCurrentSelectedElementName){
            currentSelectedElement = elements[i];
          }
        }

        //判断选择的环境变量是否已经存在
        let inputDataBeforeCreating = currentTask.getSelectedAlgorithm().inputDatas;//当前算法所输入的数据
        let theDataWillDelete = [];
        for (let i = 0; i < inputDataBeforeCreating.length; i++){
          if(theSemanticWillDelete.indexOf(inputDataBeforeCreating[i].dataName) !== -1){
            theDataWillDelete.push(inputDataBeforeCreating[i]);
          }
        }
        //删除
        for (let i = 0; i < theDataWillDelete.length; i++){
          let index = inputDataBeforeCreating.indexOf(theDataWillDelete[i]);
          if (index > -1){
            inputDataBeforeCreating.splice(index, 1);
          }
        }
        //删除环境变量与环境协变量管理器之间的连接线
        let theConnectionWillDelete = [];
        for(let i = 0; i < theDataWillDelete.length; i++){
          for (let j = 0; j < elements.length; j++){
            if (elements[j].type === 'arrow'){
              if (elements[j].start === theDataWillDelete[i] && elements[j].end === currentTask){
                theConnectionWillDelete.push(elements[j]);
              }
            }
          }
        }
        //删除与删除对象的父节点
        let theElementWillDelete = [];
        for (let i = 0; i < theDataWillDelete.length; i++){
          let count = 0;
          for (let j = 0; j < elements.length; j++){
            if (elements[j].type==='rectangle'){
              if(elements[j].hasInputData(theDataWillDelete[i])){
                count++;
              }
            }
          }
          if (count < 2){
            theElementWillDelete.push(theDataWillDelete[i]);
            for (let j = 0; j < elements.length; j++){
              if (elements[j].type === 'rectangle'){
                if(elements[j].hasOutputData(theDataWillDelete[i])){
                  // this.graphManager.deleteGraph(elements[j]);
                  this.graphManager.deleteTask(elements[j]);
                }
              }
            }

          }else if (count >= 2){
            for (let j = 0; j < elements.length; j++){
              if (elements[j].hasOutputData(theDataWillDelete[i])){
                elements[j].deleteNextTask(currentTask);
              }
            }
          }
        }
        let theElementWillDelete1 = [];
        theElementWillDelete1 = theElementWillDelete.concat(theConnectionWillDelete);
        //新增元素
        let theDataWillAdd = [];
        for (let i = 0; i < theSemanticWillAdd.length; i++){
          let newData = null;
          if (currentSelectedElement.x < currentTask.x){
            newData = new data(currentSelectedElement.x - 100, currentSelectedElement.y + i * 80, 40, 25, theSemanticWillAdd.label, this.graphManager.canvas);
          }else {
            newData = new data(currentSelectedElement.x + 100, currentSelectedElement.y + i * 80, 40, 25, theSemanticWillAdd.label, this.graphManager.canvas);
          }
          newData.hasValue = false;
          theDataWillAdd.push(newData);
          inputDataBeforeCreating.splice(-1, 0, newData);//插入现有的输入数据列表中
        }
        currentTask.setInputDatas(inputDataBeforeCreating);//更新输入的数据


        let theConnectionWillAdd = [];
        for (let i = 0; i < theDataWillAdd.length; i++){
          let con = new connection(theDataWillAdd[i], currentTask, this.graphManager.canvas);
          theConnectionWillAdd.push(con);
        }
        let theElementWillAdd = [];
        theElementWillAdd = theDataWillAdd.concat(theConnectionWillAdd);

        for (let i = 0; i < theElementWillDelete1.length; i++){
          let index = this.graphManager.list.indexOf(theElementWillDelete1[i]);
          if (index !== -1){
            this.graphManager.list.splice(index, 1);
          }
        }
        for (let i = 0; i < theElementWillAdd.length; i++){
          this.graphManager.list.splice(-1, 0, theElementWillAdd[i]);
        }
        //重新对因子的显示位置进行排序
        for (let i = 0; i < selectEnvs.length; i++){
          this.graphManager.list.forEach(function (item) {
            if(item.dataName ===  selectEnvs[i]){
              item.y = currentSelectedElement.y + i * 80;
            }
          });
        }
        //显示要素
        // let elementWillShow = [];
        // for(let i = 0; i < elements.length; i++){
        //   let tag = 0;
        //   for (let j = 0; j < theElementWillDelete1.length; j++){
        //     if (theElementWillDelete1[j] === elements[i]){
        //       tag = 1;
        //       break;
        //     }
        //   }
        //   if (tag === 0){
        //     elementWillShow.push(elements[i]);
        //   }
        // }
        //
        // let theDataWillShow = [];
        // for(let k = 0; k < selectEnvs.length; k++){
        //   let tag = 0;
        //   for (let i = 0; i < elementWillShow.length; i++){
        //     if (elementWillShow[i].type === 'ellipse' && elementWillShow[i].dataName === selectEnvs[k]){
        //       elementWillShow[i].y = initY + (k-1) * 60;
        //       theDataWillShow.push(elementWillShow[i]);
        //       tag = 1;
        //       break;
        //     }
        //   }
        //
        //   if (tag === 0){
        //     let newData = new data(initX + (k + 1) * 100, initY + (k + 1) * 50, 40, 25, selectEnvs[k], this.graphManager.canvas);
        //     // let newData = new data(initX + 120, initY + (k-1) * 60, 40, 25, selectEnvs[k], this.graphManager.canvas);//yrx
        //     newData.hasValue = false;
        //     elementWillShow.push(newData);
        //     theDataWillShow.push(newData);
        //   }
        // }
        // for (let i = 0; i < theDataWillShow.length; i++){
        //   let con = new connection(theDataWillShow[i], currentTask, this.graphManager.canvas);//old
        //   // let con = new connection(theDataWillShow[i], envDataEllipse, this.graphManager.canvas);//yrx
        //   elementWillShow.push(con);
        // }
        // // theDataWillShow = theDataWillShow.concat(this.initTaskInputData);
        // // currentTask.setInputDatas(theDataWillShow);
        // currentTask.setInputDatas(inputDataBeforeCreating);
        // for (let i = 0; i < elementWillShow.length; i++){
        //   if (elementWillShow[i].type === modelingConst.RECTANGLE){
        //     if (elementWillShow[i].taskName === currentTask.taskName){
        //       elementWillShow[i]=currentTask;
        //     }
        //   }
        // }
        // this.graphManager.list = elementWillShow;
        //todo:样点数据
        //todo:设置theCurrent task input value
        this.graphManager.reDraw(this.graphManager.list);//重绘canvas
        //保存选择的那一项
        this.$store.dispatch(actionTypes.UPDATE_SELECTED_ITEM, {key: this.mCurrentSelectedElementName, value: this.selected});
        this.closeThis();
      },
      handleChange(newTargetKeys){
        this.selected = newTargetKeys;
      },
      renderEnvs(item){
        return item.label;
      },
      filterMethod(data, query){
        return data.label.indexOf(query) > -1;
      }
    },
    watch:{
      show:function  () {
        this.$data.panelOption.headerTitle = this.mHeaderTitle;
        this.$data.TransferTitle = this.mTransferTitle;
        this.getData(this.show);
        let selectedItem = this.$store.getters.getSelectedItem(this.mCurrentSelectedElementName);
        if(selectedItem.length > 0){
          this.$data.selected = selectedItem[0].value;
          this.$data.oldSelected = selectedItem[0].value;
        }else {
          this.$data.selected = [];
          this.$data.oldSelected = [];
        }
      }
    },
    computed: {
      ...mapState({
        show: state => state.ModelState.showEnvWindow,
        basemap: state => state.basemap,
        graphManager: state => state.ModelState.graphMangerState,
        initTaskInputData:state => state.ModelState.inputData,
        mHeaderTitle: state => state.ModelState.headerTitle,
        mTransferTitle: state => state.ModelState.transferTitle,
        mDataURL: state => state.ModelState.typeDataURL,
        mCurrentSelectedElementName: state => state.ModelState.currentSelectedElementName,
      }),
    },
    props:{
      // currentTask:null,
      modelingEnvs:null
    },

  }
</script>

<style  scoped>
  .data-form {
    text-align: center;
    padding: 10px;
  }
</style>
