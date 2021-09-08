<template>
    <div ref="btncontrol"
         class="ol-button ol-unselectable ol-control"
         :class="className">
        <button :title="options.title"
                @touchstart="btnHandler"
                @click="btnHandler">
            <slot></slot>
        </button>
    </div>
</template>

<script>
import {inherits} from 'ol'
import {Control} from 'ol/control'

export default {
    name: 'button-control',
    data() {
        return {
            _options: {}
        }
    },
    computed: {
        className() {
            let cls = this._options.className || '';
            if (this.textButton) {
                cls = +'ol-text-button'
            }
            return cls;
        }
    },
    methods: {
        btnHandler(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (this._options.handleClick) this._options.handleClick.call(this, e);
        }
    },
    mounted() {
        let _this = this;
        this._options = this.options;

       let Button = function (btnOptions) {
            btnOptions = btnOptions || {};
            Control.call(this,
                {
                    element: _this.$refs.btncontrol,
                    target: btnOptions.target
                });
        };
        inherits(Button, Control);
    },
    props: {
        options: {
            type: Object,
            required: true
        },
        textButton: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss">

</style>
