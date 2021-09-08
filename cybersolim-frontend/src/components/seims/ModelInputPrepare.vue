<template>
  <div>
    <Tabs value="spatial" type="card">
      <TabPane label="Spatial Inputs" name="spatial">
        <Alert show-icon closable>You can upload model data, then select an
          appropriate one for
          each item shown in this window to prepare the model inputs. DEM, Soil,
          and Land use are recommended
          according to your application context
        </Alert>
        <Form ref="modelForm" label-position="right" :label-width="120"
              @submit.native.prevent>
          <Row>
            <Col span="12">
              <FormItem required label="DEM" title="Digital Elevation Model">
                <Select class="dataset" v-model="selectedInputs.dem" filterable
                        v-validate="'required'" name="dem"
                        placeholder="select recommend DEM"
                        :class="{'input-has-error': errors.has('dem') }"
                        clearable>
                  <Option v-for="(item,index) in initInputs.dem"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem required label="Land Use">
                <Select class="dataset" v-model="selectedInputs.landuse"
                        filterable
                        v-validate="'required'" name="landuse"
                        placeholder="select recommend land use"
                        :class="{'input-has-error': errors.has('landuse') }"
                        clearable>
                  <Option v-for="(item,index) in initInputs.landuse"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem required label="Soil map">
                <Select class="dataset" v-model="selectedInputs.soil" filterable
                        v-validate="'required'" name="soil"
                        placeholder="select recommend soil map"
                        :class="{'input-has-error': errors.has('soil') }"
                        clearable>
                  <Option v-for="(item,index) in initInputs.soil"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Outlet Shapefile">
                <Select class="dataset" v-model="selectedInputs.landuse"
                        filterable
                        name="outlet"
                        placeholder="select recommend outlet"
                        clearable>
                  <Option v-for="(item,index) in initInputs.outlet"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="Pcp Stations Distribution"
                        title="Precipitation Stations Distribution (like thiessen polygon)">
                <Select class="dataset" v-model="selectedInputs.pcpStation"
                        filterable name="pcp"
                        :class="{'input-has-error': errors.has('pcp') }"
                        placeholder="select precipitation stations distribution data"
                        clearable>
                  <Option v-for="(item,index) in initInputs.pcpStation"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Meteo Stations Distribution"
                        title="Meteorological Stations Distribution (like thiessen polygon)">
                <Select class="dataset" v-model="selectedInputs.meteoStation"
                        filterable name="meteoStation"
                        :class="{'input-has-error': errors.has('meteoStation') }"
                        placeholder="select meteorological stations distribution data"
                        clearable>
                  <Option v-for="(item,index) in initInputs.meteoStation"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="Spatial Lookups" name="lookups">
        <Alert show-icon closable>Required if you determined to use your own
          land use and soil data
        </Alert>
        <Form ref="modelForm" label-position="right" :label-width="220"
              @submit.native.prevent>
          <FormItem required label="landcover initial parameters"
                    title="landcover initial parameters csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('landcover_initial_parameters') }"
                      v-model.trim="selectedInputs.landcover_initial_parameters"
                      name="landcover_initial_parameters"
                      :options="initInputs.landcover_initial_parameters"
                      placeholder="select landcover_initial_parameters csv"></v-select>
          </FormItem>
          <FormItem required label="soil properties lookup"
                    title="soil properties lookup csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('soil_properties_lookup') }"
                      v-model.trim="selectedInputs.soil_properties_lookup"
                      name="soil_properties_lookup"
                      :options="initInputs.soil_properties_lookup"
                      placeholder="select soil_properties_lookup csv"></v-select>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="Climate Data" title="Time Series Data" name="climate">
        <Alert show-icon closable>Optional</Alert>
        <Form ref="climateForm" label-position="right" :label-width="120"
              @submit.native.prevent>
          <Row>
            <Col span="12">
              <FormItem label="Meteorological data"
                        title="meteorological daily data">
                <Select class="dataset" v-model="selectedInputs.meteorological"
                        filterable name="meteorological"
                        :class="{'input-has-error': errors.has('meteorological') }"
                        placeholder="select meteorological data csv"
                        clearable>
                  <Option v-for="(item,index) in initInputs.meteorological"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Precipitation data" title="Precipitation daily">
                <Select class="dataset" v-model="selectedInputs.precipitation"
                        filterable name="precipitation"
                        :class="{'input-has-error': errors.has('precipitation') }"
                        placeholder="select precipitation data csv"
                        clearable>
                  <Option v-for="(item,index) in initInputs.precipitation"
                          :value="item.value" :key="index">{{item.label}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="Sites_M">
                <v-select class="dataset" taggable transition
                          :class="{'input-has-error': errors.has('sites_M') }"
                          v-model.trim="selectedInputs.sites_M" name="sites_M"
                          :options="initInputs.sites_M"
                          placeholder="select Sites_M csv"></v-select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="Sites_P">
                <v-select class="dataset" taggable transition
                          :class="{'input-has-error': errors.has('Sites_P') }"
                          v-model.trim="selectedInputs.sites_P" name="Sites_P"
                          :options="initInputs.sites_P"
                          placeholder="select sites_p csv"></v-select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem label="Variables"
                      title="Units for meteorological variables">
              <Select class="dataset" v-model="selectedInputs.variableUnits"
                      filterable name="variables"
                      :class="{'input-has-error': errors.has('variables') }"
                      placeholder="select variables units csv"
                      clearable>
                <Option v-for="(item,index) in initInputs.variableUnits"
                        :value="item.value" :key="index">{{item.label}}
                </Option>
              </Select>
            </FormItem>
          </Row>
        </Form>
      </TabPane>
      <TabPane label="Observed Data" name="observed">
        <Form ref="observedForm" label-position="right" :label-width="120"
              @submit.native.prevent>
          <FormItem label="Observed Variable">
            <Select v-model.trim="selectedInputs.observedVariable"
                    name="observed_variable" class="dataset"
                    :class="{'input-has-error': errors.has('observed_variable') }"
                    placeholder="select the observed variable">
              <Option v-for="item in observedVariables" :value="item.value"
                      :title="item.title"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Observed Data">
            <Select v-model.trim="selectedInputs.observedData"
                    name="observedData" class="dataset"
                    :class="{'input-has-error': errors.has('observedData') }"
                    placeholder="select observed values csv">
              <Option v-for="item in initInputs.observedData"
                      :value="item.value"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Stations Info"
                    title="Stations info of observed variables">
            <Select v-model.trim="selectedInputs.siteInfo"
                    name="StationsInfo" class="dataset"
                    :class="{'input-has-error': errors.has('StationsInfo') }"
                    placeholder="select stations info csv of observed variables">
              <Option v-for="item in initInputs.siteInfo"
                      :value="item.value"
                      :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="Simulation Date">
            <Row>
              <Col span="12">
                <DatePicker type="date" placeholder="Select start date"
                            placement="top-end" editable transfer
                            style="width: 200px"></DatePicker>
              </Col>
              <Col span="12">
                <DatePicker type="date" placement="top-end"
                            placeholder="Select end date" editable transfer
                            style="width: 200px"></DatePicker>
              </Col>
            </Row>
               Output_Time_start
                    Cali_Time_start
                    Vali_Time_start

          </FormItem> -->
        </Form>
      </TabPane>
      <!--<TabPane label="Scenario" title="Scenario Configuration File"
               name="scenario">
        <Alert show-icon closable>Required only if you intent to conduct a
          scenario analysis
        </Alert>
        <Form ref="scenarioForm" label-position="right" :label-width="170"
              @submit.native.prevent>
          <FormItem label="areal struct management"
                    title="areal_struct_management csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('areal_struct_management') }"
                      v-model.trim="selectedInputs.areal_struct_management"
                      name="areal_struct_management"
                      :options="initInputs.areal_struct_management"
                      placeholder="select areal_struct_management csv"></v-select>
          </FormItem>
          <FormItem label="BMP_index"
                    title="BMP_index csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('BMP_index') }"
                      v-model.trim="selectedInputs.BMP_index"
                      name="BMP_index"
                      :options="initInputs.BMP_index"
                      placeholder="select BMP_index csv"></v-select>
          </FormItem>
          <FormItem label="BMP_scenarios"
                    title="BMP_scenarios csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('BMP_scenarios') }"
                      v-model.trim="selectedInputs.BMP_scenarios"
                      name="BMP_index"
                      :options="initInputs.BMP_scenarios"
                      placeholder="select BMP_scenarios csv"></v-select>
          </FormItem>
          <FormItem label="plant_management"
                    title="plant_management csv">
            <v-select class="dataset" taggable transition
                      :class="{'input-has-error': errors.has('plant_management') }"
                      v-model.trim="selectedInputs.plant_management"
                      name="BMP_index"
                      :options="initInputs.plant_management"
                      placeholder="select plant_management csv"></v-select>
          </FormItem>
        </Form>
      </TabPane>-->
      <!-- <TabPane label="Model Run Configurations"
                title="Model Configuration Files"
                name="runConfig">
                 <Form ref="modelForm" label-position="right" :label-width="120"
               @submit.native.prevent>
           <FormItem label="calibration"
                     title="calibration ini">
             <v-select class="dataset" taggable transition
                       :class="{'input-has-error': errors.has('calibration') }"
                       v-model.trim="selectedInputs.calibration"
                       name="calibration"
                       :options="initInputs.calibration"
                       placeholder="select calibration ini"></v-select>
           </FormItem>
           <FormItem required label="scenario_analysis"
                     title="scenario_analysis csv">
             <v-select class="dataset" taggable transition
                       :class="{'input-has-error': errors.has('scenario_analysis') }"
                       v-model.trim="selectedInputs.scenario_analysis"
                       name="scenario_analysis"
                       :options="initInputs.scenario_analysis"
                       placeholder="select scenario_analysis csv"></v-select>
           </FormItem>
           <FormItem required label="sensitivity_analysis"
                     title="sensitivity_analysis csv">
             <v-select class="dataset" taggable transition
                       :class="{'input-has-error': errors.has('sensitivity_analysis') }"
                       v-model.trim="selectedInputs.sensitivity_analysis"
                       name="sensitivity_analysis"
                       :options="initInputs.sensitivity_analysis"
                       placeholder="select sensitivity_analysis csv"></v-select>
           </FormItem>
         </Form>
       </TabPane>

       <TabPane label="Model Configurations" title="Model Configuration Files"
                name="config">
         config.fig
         file.in
         file.out
         param.cali
         cali_param_rng-Q.def
         morris_param_rng-Q.def
         run_ywz30m_mpi_proc12_thread2.lsf
       </TabPane>-->
    </Tabs>
    <Divider style="margin: 10px"/>
    <Form>
      <Form-item class="set-data-btn">
        <Button type="primary" @click="setData" :loading="isLoading">
          set model inputs
        </Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
  import * as actionTypes from '@/store/action-types';
  import {vIziToast} from "../../js/notify/v-iziToast";
  import vSelect from 'vue-select';

  export default {
    name: 'seims-model-input',
    data() {
      return {
        selectedInputs: {
          dem: 'srtm30',
          soil: '',
          landuse: '',
          outlet: '',
          pcpStation: '',
          meteoStation: '',
          observedVariable: '',
          observedData: '',
          siteInfo: '',
          meteorological: '',
          precipitation: '',
          sites_M: '',
          sites_P: '',
          variableUnits: '',
          landcover_initial_parameters: '',
          soil_properties_lookup: ''
        },
        initInputs: {
          //spatial
          dem: [],
          soil: [],
          landuse: [],
          outlet: [],
          pcpStation: [],
          meteoStation: [],
          // observed
          observedQ: [],
          observedSED: [],
          siteInfo: [],
          //climate
          meteorological: [],
          precipitation: [],
          sitesM: [],
          sitesP: [],
          variableUnits: [],
          //lookup
          landcoverInitialParameters: [],
          soilPropertiesLookup: [],
        },
        observedVariables: [],
        isLoading: false,
        polygonId: -1,
        disabled: true,
        spatialExtent: []
      }
    },
    mounted() {
      this.$http.get('/seims/initModelInputs').then((json) => {
        console.log(json.data);
        this.initInputs.dem = json.data.DEM;
        this.initInputs.soil = json.data.Soil;
        this.initInputs.landuse = json.data.Landuse;
      }).catch((err) => {
        vIziToast.error(err.response.data, 6000);
      });
      this.$http.get("/seims/init/observed").then((resp) => {
        this.observedVariables = resp.data;
      }).catch((err) => {
        vIziToast.error(err.response.data, 6000);
      });
    },
    components: {vSelect},
    methods: {
      showDetail() {
        this.$store.dispatch(actionTypes.SEIMS_MODEL_ID, this.modelId);
        this.$store.dispatch(actionTypes.SHOW_SEIMS_MODEL, true);
      },
      refresh() {
        // modelId
      },
      setData() {

      }
    },
    watch: {
      spatialDataId: function () {

      }
    },
    props: {
      modelId: {
        type: Number,
        required: true,
        default: -1
      },
      spatialDataId: {
        type: Number,
        required: true,
        default: -1
      },
      isReloaded: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*@import "src/assets/scss/uploader";*/

  /deep/ .ivu-tabs-context-menu {
    display: none;
  }

  .uploader .uploader-btn {
    margin-right: 4px;
    /*padding: 5px 15px 6px;*/
    line-height: 1.5;
    background-color: #f8fcf3;
    border: 1px solid #01599d;
    color: #0c0c0c;
    border-radius: 5px;

    & :hover {
      transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
    }
  }

  .set-data-btn {
    position: absolute;
    left: 30%;
  }

  .dataset {
    margin-right: 30px;
  }

  .model-toolbar {
    position: absolute;
    top: 50px;
  }
</style>
