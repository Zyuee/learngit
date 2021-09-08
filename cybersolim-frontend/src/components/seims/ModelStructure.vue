<!--
config model structure
-->
<template>
  <div>
    <div class="form-container">
      <Form ref="modelForm" label-position="right" inline :label-width="120"
            @submit.native.prevent>
        <Row>
          <Col span="9">
            <FormItem label="Model Name" required
                      :class="{'input has-error':errors.has('modelName')}">
              <Input class="form-input" v-model="app.modelName" name="modelName"
                     type="text" placeholder="model name"
                     clearable
                     v-validate="'required|alpha_dash|min:3|modelNameChecker'"></Input>
              <span v-show="errors.has('modelName')" class="help has-error">{{ errors.first('modelName') }}</span>
            </FormItem>
          </Col>
          <Col span="15">
            <Form-item :label-width="40" style="width:96%">
              <Input v-model="app.modelDescription"
                     placeholder="A brief description about your model"></Input>
            </Form-item>
          </Col>
        </Row>
        <FormItem required label="Study Area Data Layer"
                  title="select a data layer (name) as study area"
                  v-if="studyAreaLayers.length>0">
          <Select v-model="studyAreaLayerIndex" :filter-by-label="true"
                  not-found-text="no available data"
                  title="Study Area Data Layer" class="form-select">
            <Option v-for="(item,index) in studyAreaLayers"
                    :value="index" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <Row v-else>
          <Col span="7">
            <FormItem label="Study Area: left" :label-width="120">
              <Input class="bbox-input" type="text" v-model="app.minX"> </Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="top" :label-width="40">
              <Input class="bbox-input" type="text" v-model="app.maxY"> </Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="right" :label-width="40">
              <Input class="bbox-input" type="text" v-model="app.maxX"> </Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="bottom" :label-width="50">
              <Input class="bbox-input" type="text" v-model="app.minY"> </Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem required label="Purpose">
          <Select v-model="app.purpose" :filter-by-label="true"
                  title="Application Purpose" class="form-select">
            <Option v-for="(item,index) in initContext.purpose"
                    :value="item.value"
                    :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem required label="Time Step">
          <Select v-model="app.timeStep" class="form-select">
            <Option v-for="(item,index) in initContext.timeSteps"
                    :value="item.value" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem required label="Time Scale">
          <Select v-model="app.timeScale" class="form-select">
            <Option v-for="(item,index) in initContext.timeScales"
                    :value="item.value" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="Spatial Scale">
           <Select v-model="app.spatialScale" class="form-select">
             <Option v-for="(item,index) in initContext.spatialScales"
                     :value="item.value" :key="index">{{item.label}}
             </Option>
           </Select>
         </FormItem>-->
        <FormItem label="Climate Input" title="Time Series Data"
                  style="width: 98%">
          <Select v-model="app.climateInputs" filterable multiple clearable>
            <Option v-for="(item,index) in initContext.climateInputs"
                    :value="item.value" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="Surface Type" title="Underlying Surface Type">
          <Select v-model="app.underlyingSurfaceType" class="form-select">
            <Option v-for="(item,index) in initContext.surfaceTypes"
                    :value="item.value" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="Climate Features">
          <Select v-model="app.climateFeature" class="form-select">
            <Option v-for="(item,index) in initContext.climateFeatures"
                    :value="item.value" :key="index">{{item.label}}
            </Option>
          </Select>
        </FormItem>
        <Divider style="margin: 10px"/>
        <Form-item class="genBtn" :label-width="0">
          <Button type="primary"
                  id="generateBtn" @click="generate" :loading="isLoading">
            Generate model configuration
          </Button>
          <Button type="info" v-if="!disabled" id="showDetailBtn"
                  @click="showDetail" style="width: 150px; margin-top: 20px">
            View Config
          </Button>
        </Form-item>
      </Form>
    </div>
    <ModelStructureDetail :detail-show="showDetailPanel" :model-id="modelId"
                          @close="closeDetail"></ModelStructureDetail>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import JPanel from '@/components/widgets/JSPanel'
  import {vIziToast} from "../../js/notify/v-iziToast";
  import {Validator} from "vee-validate";
  import axios from "axios";
  import ModelStructureDetail from "./ModelStructureDetail";

  //检查模型名称是否被使用
  Validator.extend('modelNameChecker', {
    getMessage: (field, params, data) => 'Model already exists!',
    validate: (value) => {
      if (!value)
        return false;
      return axios.get('/seims/name/' + value).then(res => {
        return {
          valid: res.data // api will return 'true' if the name has not been used, otherwise 'false'
        };
      }).catch(error => {
        return {
          valid: false
        };
      });
    }
  });

  export default {
    name: 'seims-model-structure',
    data() {
      return {
        app: {
          purpose: 'total runoff simulation',
          timeStep: 'daily',
          timeScale: 'continous',
          spatialScale: 'medium-sized',
          //climate type
          climateFeature: 'humid',
          underlyingSurfaceType: 'rural',
          climateInputs: ["P", "TMAX", "TMIN"],
          modelName: 'seims_demo',
          modelDescription: '',
          polygonId: -1,
          //1:vector;2:raster;3:bbox
          layerType: -1,
          rasterFileId: -1,
          minX: -1,
          minY: -1,
          maxX: -1,
          maxY: -1
        },
        initContext: {},
        isLoading: false,
        modelId: -1,
        showDetailPanel: false,
        disabled: true,
        uploadFile: null,
        studyAreaLayerIndex: 0
      }
    },
    mounted() {
      this.$http.get('/seims/init/context').then((json) => {
        this.initContext = json.data;
      }).catch((err) => {
        vIziToast.error(err.response.data, 6000);
      });
      if (this.studyAreaLayers.length === 0) {
        this.app.minX = this.studyAreaBbox[0].toFixed(3);
        this.app.minY = this.studyAreaBbox[1].toFixed(3);
        this.app.maxX = this.studyAreaBbox[2].toFixed(3);
        this.app.maxY = this.studyAreaBbox[3].toFixed(3);
      }
      /*  this.$http.get('/seims/reload/seims_demo').then((resp) => {
          this.app = resp.data;
        });*/
    },
    components: {ModelStructureDetail, JPanel},
    methods: {
      generate() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            if (this.studyAreaLayers.length === 0) {
              this.app.minX = this.studyAreaBbox[0];
              this.app.minY = this.studyAreaBbox[1];
              this.app.maxX = this.studyAreaBbox[2];
              this.app.maxY = this.studyAreaBbox[3];
              this.app.layerType = 3;
            } else {
              let studyAreaLayer = this.studyAreaLayers[this.studyAreaLayerIndex];
              if (studyAreaLayer.dataType === 'Vector') {
                this.app.polygonId = studyAreaLayer.dataLayerId;
                this.app.layerType = 1;
              } else if (studyAreaLayer.dataType === 'Raster') {
                this.app.rasterFileId = studyAreaLayer.dataLayerId;
                this.app.layerType = 2;
              }
            }
            this.$http.post('/seims/generate', this.app).then((resp) => {
              this.modelId = resp.data.modelId;
              //model dataset id
              let spatialDataId = resp.data.datasetId;
              this.disabled = false;
              this.showDetail();
              //pass to modelPanel.vue
              this.$emit("update", {
                modelId: this.modelId,
                spatialDataId: spatialDataId
              })
            }).catch(err => {
              console.error(err)
              vIziToast.error(err.msg)
            });
          }
        });
      },
      showDetail() {
        this.showDetailPanel = true;
      },
      closeDetail() {
        this.showDetailPanel = false;
      },
      reloadModel() {
        if (this.reloadModelId > -1) {
          this.$http.get("/seims/reload/" + this.reloadModelId).then(resp => {
            console.log(resp.data);
          });
        }
      }
    },
    computed: {
      ...mapState({
        studyAreaLayers: state => state.MapState.studyAreaLayers.map(item => {
          return {
            dataType: item.dataType,
            dataLayerId: item.dataLayerId,
            label: item.layerName
          }
        }),
        studyAreaBbox: state => state.MapState.clickGeometry
      })
    },
    watch: {
      reloadModelId: function () {
        this.reloadModel();
      }
    },
    props: {
      reloadModelId: {
        type: Number,
        default: -1
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/validate";

  .genBtn {
    position: absolute;
    text-align: center;
    margin-left: 35%;
  }

  .form-select {
    width: 220px;
  }

  .form-container {
    padding: 0 10px 0 10px;

    .form-input {
      width: 150px;
    }
  }

  .bbox-input {
    width: 80px;
  }
</style>
