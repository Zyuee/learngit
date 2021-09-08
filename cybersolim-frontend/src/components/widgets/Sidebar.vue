<!--
地图侧边栏组件
https://github.com/Turbo87/sidebar-v2
注意：使用了vue-router时，不能像普通html里面一样使用锚点
-->
<template>
  <div ref="sidebar" class="sidebar sidebar-left" :class="{collapsed:!isActive}" :style="sideStyle">
    <!-- Nav tabs -->
    <div class="sidebar-tabs">
      <ul role="tablist">
        <li v-for="(tab,index) in _tabs" :class="{active:tab.active}">
          <a @click.prevent="tabsShow(index)" role="tab" :title="tab.title">
            <Icon :type="tab.icon" size="20" color="black" ></Icon>
          </a>
        </li>
      </ul>
      <!--bottom tabs-->
      <ul role="tablist">
        <li v-for="(tab,index) in _bottomTabs" :class="{active:tab.active}">
          <a @click.prevent="bottomTabsShow(index)" role="tab" :title="tab.title">
            <Icon :type="tab.icon" size="20" color="black" ></Icon>
          </a>
        </li>
      </ul>
    </div>
    <!-- Tab panes -->
    <div class="sidebar-content">
      <div class="sidebar-pane" :id="pane.id" v-for="pane in panes" :class="{active:pane.active}">
        <h1 class="sidebar-header">
          {{pane.title}}
          <span class="sidebar-close" @click="collapse">
            <Icon type="android-arrow-dropleft" size="20"> </Icon>
          </span>
        </h1>
        <!--Tab content-->
        <slot :name="pane.id"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'sidebar',
    data(){
      return {
        isActive: false,// 控制侧边栏是否收缩
        active: 'active',
        _tabs: [],
        _bottomTabs: []
      }
    },
    methods: {
      tabsShow( i ){
        let j;
        // 如果是收起状态
        if (!this.isActive) {
          this.isActive = true;
        }
        else {
          //如果是点击激活的tab
          for (j = this._tabs.length - 1; j >= 0; j--) {
            if (j==i && this._tabs[i].active) {
              this.isActive = false;
            }
          }
        }
        this.switchActive(i, this.panes.length - 1 - this._bottomTabs.length, this._bottomTabs, this._tabs);
      },
      bottomTabsShow( i ){
        let j;
        if (!this.isActive) {
          this.isActive = true;
        }
        else {
          for (j = this._bottomTabs.length - 1; j >= 0; j--) {
            if (j===i && this._bottomTabs[i].active) {
              this.isActive = false;
            }
          }
        }
        this.switchActive(i, this.panes.length - 1 - this._tabs.length, this._tabs, this._bottomTabs);
      },
      /**
       * 切换active状态
       * @param i 当前点击的tab序号
       * @param panesLen 对应的panes的长度（tabs对应tabs的panes）
       * @param arr 非点击的数组（点击tabs时为bottomTabs）
       * @param arrEqual 点击的数组（需要判断当前点击tab的序号）
       */
      switchActive( i, panesLen, arr, arrEqual ){
        let k;
        for (k = panesLen; k >= 0; k--) {
          if (k==i) {
            this.panes[k].active = true;
          }
          else {
            if (this.panes[k].active) {
              this.panes[k].active = false;
            }
          }
        }
        for (k = arr.length - 1; k >= 0; k--) {
          if (arr[k].active) {
            arr[k].active = false;
          }
        }
        for (k = arrEqual.length - 1; k >= 0; k--) {
          if (k==i) {
            arrEqual[k].active = true;
          }
          else {
            if (arrEqual[k].active) {
              arrEqual[k].active = false;
            }
          }
        }
      },
      collapse(){
        this.isActive = false;
      }
    },
    created(){
      //动态添加的属性，必须使用 Vue.set(object, key, value) 方式，否则就不是响应式的，即数据更新之后，DOM不会相应更新
      this._tabs = this.tabs;
      let j;
      for (j = this._tabs.length - 1; j >= 0; j--) {
        this.$set(this._tabs[j], "active", false)
      }
      if (this.bottomTabs)
        this._bottomTabs = this.bottomTabs;
      for (j = this._bottomTabs.length - 1; j >= 0; j--) {
        this.$set(this._bottomTabs[j], "active", false)
      }
    },
    watch:{
      refreshProjects:function (refresh) {
        if (refresh) {
          this.tabsShow(2);
        }
      }
    },
    computed: {
      panes(){
        return this._tabs.concat(this._bottomTabs);//合并两个数组
      },
      sideStyle(){
        if (this.isActive)
          return {
            width: this.sidebarWidth + 'px'
          }
      },
      ...mapState({
        refreshProjects:state => state.ProjectSate.refreshProjects
      })
    },
    props: {
      tabs: {
        type: Array,
        required: true,
        default: [
          {
            id: 'home',
            icon: 'navicon-round',
            title: 'Home'
          }
        ]
      },
      bottomTabs: {
        type: Array,
        required: false,
        default(){
          return []; // 不能直接使用 default:[]形式
        }
      },
      sidebarWidth: {
        type: Number,
        required: false,
        default: 350
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './scss/sidebar.scss';
</style>
