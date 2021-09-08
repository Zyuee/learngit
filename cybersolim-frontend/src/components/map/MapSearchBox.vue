<template>
    <div id="search-box">
        <i-input v-model="search"
                 icon="ios-search"
                 title="Input study area's name or select a area type"
                 @on-click="goSearch"
                 @on-focus="inputFocus"
                 v-on-clickaway="away"
                 placeholder="search study area..."
                 style="width: 200px"></i-input>
        <transition name="bounce">
            <ul class="suggestions"
                v-show="show">
                <li class="suggest"
                    @click="selectSuggest(value)"
                    v-for="value in suggestions">
                    <span>{{value}}</span>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

/**
 * 地图搜索框
 */
export default {
    name: 'search-box',
    mixins: [clickaway],
    data() {
        return {
            search: '',
            show: false,
            suggestions: ['Latest study area', 'My study areas', 'Shared areas']
        }
    },
    methods: {
        goSearch() {
            this.$Message.info(this.search)
        },
        inputFocus() {
            this.show = !this.show;
        },
        // 选择候选值
        selectSuggest(v) {
            this.search = v;
        },
        // 点击外面时隐藏此元素
        away() {
            if (this.show)
                this.show = false;
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/scss/widgets.scss';

#search-box {
    position: fixed;
    top: $widget-top;
    left: $widget-left;
    right: auto;
    bottom: auto;
    height: 40px;
    font-size: 13px;
    z-index: $widget-z-index;
    .ivu-input {
        font-size: 13px;
        height: 35px;
        line-height: 35px;
    }
    .ivu-input-icon {
        height: 35px;
        line-height: 35px;
    }
}

.suggestions {
    position: absolute;
    list-style: none;
    background: rgba(255, 255, 255, 0.95);
    width: 100%;
    top: 37px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    .suggest {
        padding: 12px;
        min-height: 15px;
        line-height: 15px;
        text-align: left;
        vertical-align: middle;
        position: relative;
        cursor: pointer;
        color: grey;
        border-bottom: 1px solid rgba(214, 218, 218, 0.25);
        &:hover {
            background: #41b883;
            color: white;
            font-weight: 400;
            border: 1px solid white;
        }
    }
    .selected {
        background: #FF6A6A
    }
}
</style>
