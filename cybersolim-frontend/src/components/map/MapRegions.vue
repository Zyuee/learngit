<template>
    <div id="area">
        <multiselect v-model="selectedAreaType"
                     placeholder="search study area"
                     :searchable='true'
                     selectLabel=""
                     deselectLabel=""
                     :options="options"></multiselect>
        <button @click="changed"
                icon="ios-search"
                type="info">dd</button>

    </div>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Multiselect from 'vue-multiselect'
// import Vue from 'vue'

/**
 * 查询的研究区（地图）范围：最新研究区？、自己所有的研究区、所有共享的研究区
 */
export default {
    components: { Multiselect },
    name: 'map-region',
    data() {
        return {
            selectedAreaType: null, // TODO 需要使用vuex管理
            options: ['Latest study area', 'All my study areas', 'All shared areas'],
            suggestionAttribute: '',
            suggestions: ['Latest study area', 'All my study areas', 'All shared areas'],
            value: ''
        }
    },
    methods: {
        changed() {
            this.$Message.info(this.value);
            // console.log(this.selectedAreaType)
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/widgets.scss';

@media (max-width: 540px) {
    #area {
        display: none;
    }
}

#area {
    width: 140px;
    height: 30px;
    position: fixed;
    top: $widget-top;
    left: $widget-left + 13rem;
    z-index: $widget-z-index;
}

// 自定义multiselect的样式
$select-height:30px;
.multiselect {
    min-height: $select-height;
    .multiselect__select {
        height: $select-height;
    }
    .multiselect__tags {
        min-height: $select-height;
        padding: 5px 30px 0 5px;
        .multiselect__input {
            font-size: 12px;
        }
    }
}
</style>
