<template>
  <transition name="slide-up">
    <j-panel :options="panelOption" :show="show" class="data-form">
      <Form>
        <Form-item label="Name" :label-width="70">
          <Select v-model.trim="selectedModelId" class="dataset"
                  filterable :loading="loading"
                  @remote-method="retrieveModel"
                  placeholder="enter the name to search, select the model to reload">
            <Option v-for="item in models"
                    :value="item.id"
                    :key="item.id">{{ item.modelName }}
            </Option>
          </Select>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click="select">Select
          </Button>
          <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>
    </j-panel>
  </transition>
</template>

<script>
  import JPanel from '@/components/widgets/JSPanel'
  import {vIziToast} from '../../js/notify/v-iziToast'

  export default {
    name: 'model-select',
    data() {
      return {
        panelOption: {
          id: 'model-select',
          paneltype: 'modal',
          theme: "success",
          headerTitle: 'Select a model',
          draggable: true,
          headerControls: {maximize: "remove"},
          contentSize: {
            width: 250,
            height: 150
          },
          onclosed: this.closeThis,
          resizeit: false
        },
        models: [],
        selectedModelId: -1,
        loading: false
      }
    },
    components: {JPanel},
    methods: {
      closeThis() {
        this.$emit('close');
      },
      select() {
        console.log(this.selectedModelId);
        this.$emit('reloadModel', this.selectedModelId);
        this.$emit('close');
      },
      retrieveModel(query) {
        this.loading = true;
        this.$http.get("/seims/search/" + query).then((resp) => {console.log(resp.data);
          this.models = resp.data;

          this.loading = false;
        });
      }
    },
    computed: {
      show() {
        if (this.modelShow) {
          this.$http.get("/seims/models").then((resp) => {
            this.models = resp.data;
          });
        }
        return this.modelShow;
      }
    },
    props: {
      modelShow: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../data/scss/data-create.scss";
</style>
