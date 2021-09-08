<template>
    <Card v-if="show"
          dis-hover
          shadow
          class="card"
          :style="styleObj"
          :class="cardType">
        <p slot="title">
            {{title}}
            <a class="card-close"
               @click.prevent="close">
                <Icon slot="extra"
                      size="31"
                      type="ios-close-empty"></Icon>
            </a>
        </p>
        <div class="card-body">
            <slot name="content"></slot>
        </div>
    </Card>
</template>

<script>
export default {
    name: 'closeable-card',
    data() {
        return {
        }
    },
    computed: {
        cardType() {
            return 'card-' + this.cardtype;
        },
        styleObj() {
            let obj = {};
            if (this.isDefined(this.position.left)) obj.left = this.position.left + 'rem';
            if (this.isDefined(this.position.right)) obj.right = this.position.right + 'rem';
            if (this.isDefined(this.position.top)) obj.top = this.position.top + 'rem';
            if (this.isDefined(this.position.bottom)) obj.bottom = this.position.bottom + 'rem';
            return obj;
        }
    },
    methods: {
        close() {
            // 触发父组件close方法，以便改变显示状态
            this.$emit('close');
        },
        isDefined(v) {
            return typeof (v) !== 'undefined';
        }
    },
    props: {
        title: {
            type: String,
            default: 'Title',
            required: true
        },
        show: {
            type: Boolean,
            default: false
        },
        cardtype: {
            type: String,
            default: 'default'
        },
        position: {
            type: Object,
            default() {
                return {
                    right: 3,
                    top: 6
                }
            }
        }
    }
}
</script>

<style lang="scss">
.card {
    position: absolute;
    border-top-left-radius: 6.5px;
    border-top-right-radius: 6.5px;
    .card-close {
        position: absolute;
        top: 9px;
        right: 16px;
    }
}

.card-body {}

// from boostrap3 panel scss: https://github.com/twbs/bootstrap-sass/blob/master/assets/stylesheets/bootstrap/_cards.scss
@mixin card-header($color, $bg-color, $border-color) {
    background-color: $bg-color;
    border-color: $border-color;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    text-align:left;
    p {
        color: $color;
        a>i {
            color: $color
        }
    }
}

.ivu-card-shadow:hover {
    box-shadow: 0 1px 1px 3px rgba(0, 0, 0, .1)
}

.card-default {
    .ivu-card-head {
        @include card-header(grey, #f5f5f5, #ddd);
    }
}

.card-primary {
    .ivu-card-head {
        @include card-header(#fff, #337ab7, #337ab7);
    }
}

.card-success {
    .ivu-card-head {
        @include card-header(#3c763d, #dff0d8, #d6e9c6);
    }
}

.card-info {
    .ivu-card-head {
        @include card-header(#31708f, #d9edf7, #bce8f1);
    }
}

.card-warning {
    .ivu-card-head {
        @include card-header(#8a6d3b, #fcf8e3, #faebcc);
    }
}

.card-danger {
    .ivu-card-head {
        @include card-header(#a94442, #f2dede, #ebccd1);
    }
}

.ivu-card-extra {
    top: 10px;
}
</style>
