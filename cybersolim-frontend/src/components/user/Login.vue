<template>
  <div class="content">
    <div th:replace="error/outofdated"></div>
    <div id="bubbles">
      <bg-bubble></bg-bubble>
    </div>
    <Row type="flex" align="middle" :gutter="60" justify="center">
    <!--  <i-col id="left" :xs="0" :sm="11" :md="13">
        <Card id="des" props="bordered,shadow">
          &lt;!&ndash;     可以单独设计一个组件，嵌入到这里     &ndash;&gt;
        </Card>
      </i-col>-->
<!--      <i-col :xs="10" :sm="9" :md="8" id="login" class="wrapper">-->
      <i-col :xs="15" :sm="14" :md="12" id="login" class="wrapper">
        <div class="animate form">
          <Alert type="error" v-if="this.loginErr.length!=''" class="login-err" show-icon closable>
            <span slot="desc" v-html="loginErr">
            </span>
          </Alert>
          <h1 class="text-center">USER LOGIN</h1>
          <Form ref="form" :model="credentials" label-position="left"  >
            <Form-item :class="{'input has-error':errors.has('email')}">
              <i-input v-model="credentials.email" type="text" auto-complete="on" size="large"
                       placeholder="your-mail@mail.com" name="email" v-validate="'required|email'">
                <Icon type="ios-mail-outline" :size='20' slot="prepend"></Icon>
              </i-input>
              <span v-show="errors.has('email')" class="help has-error">{{ errors.first('email') }}</span>
            </Form-item>
            <Form-item :class="{'input has-error':errors.has('password')}">
              <i-input v-model="password" auto-complete="off" type="password" @keyup.enter.native="onSubmit" name="password" size="large"
                       placeholder="password: at least 3 characters" v-validate="'required|alpha_dash|min:3'">
                <Icon type="ios-lock-outline" :size='20' slot="prepend"></Icon>
              </i-input>
              <span v-show="errors.has('password')" class="help has-error">{{ errors.first('password') }}</span>
            </Form-item>
            <Form-item>
              <Button type="primary" id="loginBtn" @click="onSubmit" long
                      :loading="isLoading">Login
              </Button>
            </Form-item>
            <div class="change_link">
              <div class="reset">
                <router-link to="/reset" class="to_register">Reset password</router-link>
              </div>
              Not a member yet ?
              <router-link to="/register" class="to_register">Join us</router-link>
            </div>
          </Form>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';
  import BgBubble from '../widgets/Bg-Bubble'
  import Encrypt from '../../js/auth/Encrypt'
  import { vIziToast } from '../../js/notify/v-iziToast'

  export default {
    $_veeValidate: {
      validator: 'new'
    }, // 创建一份新的验证器
    name: 'user-login',
    components: {
      BgBubble
    },
    // 数据
    data() {
      return {
        credentials: {
          email: '',
          password: ''
        },
        password: '',
        isLoading: false,
        loginErr: ''
      }
    },
    methods: {
     // v 3.2.1
     /*
     onSubmit() {
        this.$validator.validateAll().then(( result ) => {
          if (result) {
            this.isLoading = true;
            this.$http.get('/auth/encryptKey').then(resp => {
              let key = resp.headers.auth;
              this.credentials.password = Encrypt.AesEcbEncrypt(key, this.password);
              // url 默认为 auth/login
              this.$auth.login({
                // for Axios is 'data', for VueResource is 'body'
                data: this.credentials,
                redirect: {name: 'index'},
                //If set to false it will be "short lived" data and expire after the browser is closed.
                //If set to true it will be "long lived" and remain available for when the user returns.
                staySignedIn: false,
                fetchUser: true
              }).then(()=>{
                vIziToast.success('Login success!'); // json.data 为空
                this.isLoading = false;
              },(err)=>{
                if (err.response) {
                  vIziToast.error(err.response.data.msg, 8000);
                  this.loginErr = err.response.data.msg;
                  setTimeout(()=>{
                    this.loginErr='';
                  },5000);
                  this.isLoading = false;
                }
              });
            }).catch(err => {
              //err.name Error
              vIziToast.error(err.message, 8000);
              this.isLoading = false;
            });
          }
          else {
            vIziToast.error('Login form validation failed! Please check!');
          }
        }).catch(err => {
          console.log(err);
        });
      }*/
     // v 2.22
      onSubmit() {
        this.$validator.validateAll().then(( result ) => {
          if (result) {
            this.isLoading = true;
            let _this = this;
            this.$http.get('/auth/encryptKey').then(resp => {
              let key = resp.headers.auth;
              this.credentials.password = Encrypt.AesEcbEncrypt(key, this.password);
              // url 默认为 auth/login
              this.$auth.login({
                data: this.credentials,
                success: function( json ) {
                  vIziToast.success('Login success!'); // json.data 为空
                  _this.isLoading = false;
                },
                error: function( err ) {
                  if (err.response) {
                    vIziToast.error(err.response.data.msg, 8000);
                    this.loginErr = err.response.data.msg;
                    setTimeout(()=>{
                      this.loginErr='';
                    },5000);
                    _this.isLoading = false;
                  }
                },
                redirect: '/index',
                fetchUser: true
              });
            }).catch(err => {
              console.log(err);
              this.isLoading = false;
            });
          }
          else {
            vIziToast.error('Login form validation failed! Please check!');
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./scss/login.scss";
  @import '../../assets/scss/validate.scss';
</style>
