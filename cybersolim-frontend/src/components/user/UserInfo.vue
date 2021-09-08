<template>
  <div class="profile">
    <img class="user"
         :src="userImg"
         alt="user profile"
         @click.stop="showBox"/>
    <lazy-render>
      <user-profile></user-profile>
      <group></group>
    </lazy-render>
    <!--带过渡效果-->
    <transition name="slide-up">
      <div v-show="show"
           v-on-clickaway="away"
           class="detail-box animated">
        <div class="arrow"></div>
        <div class="top-zone">
          <div class="top-zone-img">
            <img class="user"
                 :src="userImg"
                 alt="user's avatar"/>
          </div>
          <div class="username">Hi, {{user.userFirstName}} </div>
          <div class="welcome">Welcome to EasyGC!</div>
        </div>
        <div>
          <li class="menu-group">
            <ul class="nest-menu">
              <li class="menu-item"
                  @click="showUserProfile">
                <Icon type="ios-person"></Icon>
                My Profile
              </li>
              <li class="menu-item" @click="showUserGroup">
                <Icon type="ios-people"
                      size="18"></Icon>
                My Groups
              </li>
              <li class="menu-item"
                  size="18">
                <Icon type="ios-chatbubbles"></Icon>
                Messages
                <Badge :count="msg.count"
                       class-name="bg"
                       overflow-count="10">
                </Badge>
              </li>
            </ul>
          </li>
          <li class="menu-group">
            <ul class="nest-menu">
              <li class="menu-item logout" @click.prevent="logout">
                <Icon type="ios-log-out"
                      size="18"></Icon>
                Log Out
              </li>
            </ul>
          </li>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  /**
   * 用户信息管理组件
   * @author houzhiwei
   */
  import { mapState } from 'vuex'
  /**
   * 方法 away
   * @see https://github.com/simplesmiler/vue-clickaway
   */
  import { mixin as clickaway } from 'vue-clickaway';
  import * as actionTypes from '../../store/action-types'
  import UserProfile from './UserProfile';
  import Group from './Group'

  export default {
    name: 'user-info',
    mixins: [clickaway],
    components: {
      Group,
      UserProfile
    },
    data() {
      return {
        show: false,
        msg: {
          count: 0,
          content: 'hh'
        }
      }
    },
    computed: {
      ...mapState({
        showProfile: state => state.UserState.showProfile,// 用户面板显示状态
        showGroup: state => state.UserState.showGroup
      }),
      // 用户头像。若为空，则显示默认的
      userImg(){
        if (this.user.img) {
          return this.user.img;
        }
        else {
          return require('../../assets/img/user.jpg');
        }
      },
      user(){
        return this.$auth.user() || {};
      }
    },
    mounted () {

    },
    methods: {
      // 显示或隐藏用户信息框
      showBox() {
        this.show = !this.show;
      },
      // 显示用户个人信息面板
      showUserProfile() {
        this.showBox(); // 控制userbox显示
        this.$store.dispatch(actionTypes.SHOW_USER_PROFILE, true); // 改变面板显示状态
      },
      showUserGroup(){
        this.showBox();
        this.$store.dispatch(actionTypes.SHOW_GROUP, true);
      },
      closePanel() {
        this.$store.dispatch(actionTypes.SHOW_USER_PROFILE, false);
      },
      // 点击div之外时隐藏div。例外元素（点击时不隐藏div的元素）要阻止其click事件冒泡：stopPropagation
      away() {
        if (this.show)
        {
          this.show = false;
        }
      },
      logout(){
        // url 默认为 'auth/logout'
        this.$auth.logout({
          makeRequest: true,
          success: function() {},
          error: function() {},
          redirect: '/'
          // redirect: '/login',
        });
      }
    },
    props: ['img']
  }
</script>

<style lang="scss">
  @import '../../assets/scss/widgets.scss';

  $user-box-color: rgba(255, 255, 255, 0.86);
  $user-box-topzone-color: #107be6;
  $user-menu-top-color: grey;
  .user {
    top: 3px;
    right: $widget-right;
    // z-index: $widget-z-index;
    float: right;
    background: white;
    height: 2.3rem;
    width: 2.3rem;
    border-radius: 3rem;
    border: 2px white solid;
    box-shadow: 1px 2px 3px rgba(96, 91, 91, 0.69);
    position: relative;
    &:hover {
      cursor: pointer
    }
  }

  // 参考百度地图样式
  .detail-box {
    border-radius: 5px;
    background-color: $user-box-color;
    position: absolute;
    width: 250px;
    top: 3.6rem;
    right: .5rem;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
    z-index: $widget-z-index;
  }

  .arrow {
    position: absolute;
    right: 1rem;
    top: -7px;
    border-color: transparent transparent $user-box-topzone-color;
    border-width: 0 7px 8px;
    border-style: solid;
    width: 0;
    height: 0;
  }

  $user-top-text-height: 32.5px;
  .top-zone {
    background: $user-box-topzone-color;
    color: white;
    height: 75px;
    text-align: left;
    .top-zone-img {
      padding-left: 1.5rem;
      img {
        float: left;
        height: 3rem;
        width: 3rem;
        margin-top: .6rem;
      }
    }
    .username {
      height: $user-top-text-height;
    }
    .welcome {
      height: $user-top-text-height;
      line-height: $user-top-text-height
    }
  }

  .menu-group {
    border-bottom: 1px solid #e0e0e0;
  }

  .logout {
    border-top: 1px solid rgba(0, 0, 0, 0.38);
  }

  li.menu-item {
    text-align: left;
    padding-left: 1.5rem;
    border-bottom: 1px dashed #d8d2d2;
    &:hover {
      background-color: #41b883; // #d4d4d4;
      cursor: pointer;
      color: white;
    }
    i {
      vertical-align: middle;
      padding-right: .5rem;
    }
  }

  .ivu-badge {
    padding-bottom: 1rem;
    .bg {
      background: green;
    }
  }
</style>
