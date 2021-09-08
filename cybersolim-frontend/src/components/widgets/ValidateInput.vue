<!--
包含验证样式输入框
@author: houzhiwei
@date: 2017/6/23 22:04
-->

<template>
  <div class="validate-input">
    <Form-item :label="label" :label-width="labelWidth" :class="itemClass">
      <!--
      直接使用i-input时，vee-validate的confirm验证有问题，因此此处借用其样式，但使用原生的input
      class="ivu-input"
      -->
      <div aria-required="true" aria-invalid="false" :class="inputClass">
        <template v-if="prepend">
          <div class="ivu-input-group-prepend">
            <i :class="iconClass" :style="iconStyle" style="font-size: 20px;"></i>
          </div>
          <div class="ivu-input-inner-container">
            <slot></slot>
          </div>
        </template>
        <template v-else>
          <i :class="iconClass" :style="iconStyle"></i>
          <slot></slot>
        </template>
      </div>
      <span v-show="hasError" class="help has-error">{{ errorMsg }}</span>
    </Form-item>
    <Icon type="md-close" v-if="hasError" color="red" class="error-icon"></Icon>
    <Icon type="md-checkmark" v-if="isValid" color="green" class="error-icon"></Icon>
  </div>
</template>

<script>

  export default {
    name: 'validate-input',
    data() {
      return {}
    },
    computed: {
      itemClass() {
        return {
          'input has-error': this.hasError,
          'input no-error': this.isValid // field has been validated at least once and that it passed the validation.
        }
      },
      inputClass() {
        //  参考 https://github.com/iview/iview/blob/2.0/src/components/icon/icon.vue
        let cls = {};
        let clasz = 'ivu-input-wrapper ivu-input-type ivu-input-group '
        if (this.prepend) {
          clasz += 'ivu-input-group-with-prepend '
        }
        if (this.size) {
          clasz += 'ivu-input-wrapper-' + this.size + ' ivu-input-group-' + this.size;
        }
        cls[clasz] = true
        return cls;
      },
      iconClass() {
        if (!this.prepend) {
          return 'ivu-icon ivu-input-icon ivu-icon-' + this.icon;
        } else {
          return 'ivu-icon ivu-icon-' + this.icon;
        }
      },
      iconStyle() {
        let style = {};
        if (this.iconSize) {
          style['font-size'] = this.iconSize + 'px';
        }
        if (this.color) {
          style.color = this.iconColor;
        }
        return style;
      },
      labelWidth() {
        if (this.label === '')
          return 0;
        else
          return this.width;
      }
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 120
      },
      icon: {
        type: String,
        default: 'ios-lock'
      },
      prepend: {
        type: Boolean,
        default: false
      },
      hasError: {
        type: Boolean,
        default: false
      },
      isValid: {
        type: Boolean,
        default: false
      },
      errorMsg: {
        type: String,
        default: 'invalid'
      },
      size: String,
      iconSize: [Number, String],
      iconColor: String
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/validate.scss';

  /* .ivu-form-item {
     margin-bottom: 16px;
   }*/
  .validate-input {
    position: relative;
  }

  .validate-input > i {
    position: absolute;
    right: -17px;
    top: 0;
  }

  .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
</style>
