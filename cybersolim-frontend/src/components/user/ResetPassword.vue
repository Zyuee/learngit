<template>
  <div class="content">
    <div id="bubbles">
      <bg-bubble></bg-bubble>
    </div>
    <Row type="flex" align="middle" :gutter="60" justify="center">
      <i-col :xs="15" :sm="14" :md="12" id="reset" class="wrapper">
        <div class="animate form">
          <Alert type="error" v-if="resetInfo.length!=''" class="login-err" closable>
            <span slot="desc" v-html="resetInfo">
            </span>
          </Alert>
          <h1 class="text-center">RESET PASSWORD</h1>
          <Form ref="form" :model="credentials" label-position="left">
            <Form-item :class="{'input has-error':errors.has('email')}">
              <i-input v-model="credentials.email" type="text" auto-complete="on" size="large"
                       placeholder="your-mail@mail.com" name="email" v-validate="'required|email'">
                <Icon type="ios-mail-outline" :size='20' slot="prepend"></Icon>
              </i-input>
              <span v-show="errors.has('email')" class="help has-error">{{ errors.first('email') }}</span>
            </Form-item>
            <Form-item v-show="!show">
              <Button type="primary" id="sendBtn" @click="onSendEmail" long
                      :loading="isLoading">Send Reset E-Mail
              </Button>
            </Form-item>

            <div v-if="show">
              <Form-item :style="codeStyle">
                <i-input v-model="code" type="text" size="large"
                         placeholder="reset code from the e-mail" name="code" v-validate="'required'">
                  <Icon type="md-key" :size='20' slot="prepend"></Icon>
                </i-input>
                <span v-show="errors.has('code')" class="help has-error">{{ errors.first('code') }}</span>
              </Form-item>
              <!--     password         -->
                <validate-input icon="ios-lock" prepend='true'
                                :has-error="errors.has('password')" :error-msg="errors.first('password')"
                                :is-valid="veeFields.password && veeFields.password.valid">
                  <input type="password" v-model="password"
                         v-validate="'required|alpha_dash|min:3|confirmed:password_confirm'"
                         name="password" class="ivu-input" placeholder="new password: minimum of 3 characters"/>
                </validate-input>
              <!--     password  again       -->
                <validate-input icon="ios-lock" auto-complete="off" prepend='true'
                                :has-error="errors.has('password')" :error-msg="errors.first('password')"
                                :is-valid="veeFields.password && veeFields.password.valid">
                  <input type="password" name="password_confirm" v-model="password_confirm" class="ivu-input"
                         placeholder="password again" ref="password_confirm" />
                </validate-input>

              <Form-item>
                <Button type="primary" id="resetBtn" @click="onSubmit" long :loading="isLoading">Reset
                  Password
                </Button>
              </Form-item>
              <div class="change_link">
                <div class="reset resetBtnCls">
                  <Button @click="showCode">Do not have a reset code?</Button>
                </div>
                <router-link to="/login" class="to_register">Go and log in</router-link>
              </div>
            </div>

            <div class="change_link resetBtnCls" v-if="!show">
              <Button @click="showCode">Got reset code already?</Button>
            </div>
          </Form>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import BgBubble from '../widgets/Bg-Bubble'
  import Encrypt from '../../js/auth/Encrypt'
  import {vIziToast} from '../../js/notify/v-iziToast'
  import ValidateInput from '../widgets/ValidateInput'

  export default {
    $_veeValidate: {
      validator: 'new'
    }, // 创建一份新的验证器
    name: 'user-reset',
    components: {
      BgBubble, ValidateInput
    },
    data() {
      return {
        credentials: {
          email: '',
          password: ''
        },
        code: '',
        password: '',
        password_confirm:'',
        isLoading: false,
        resetInfo: '',
        show: false
      }
    },
    methods: {
      onSendEmail() {
        this.$validator.validate().then((result) => {
          if (result) {
            this.isLoading = true;
            this.$http.get("/auth/reset/pwd", {params: {email: this.credentials.email}}).then(resp => {
              if (resp.data.code === 404) {
                vIziToast.error(resp.data.msg);
              } else {
                this.show = true;
                this.resetInfo = resp.data.msg;
                this.isLoading = false;
                vIziToast.success( resp.data.msg, 16000)
                setTimeout(() => {
                  this.resetInfo = '';
                }, 16000);
              }
            }).catch(err => {
              if (err.response) {
                console.log("error:  " + err.response);
                vIziToast.error(err.response.message, 6000)
              } else {
                // 不加"" 不会显示内容
                vIziToast.error("" + err, 6000, 'center')
              }
            });
          }
        })
      },
      onSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.isLoading = true;
            this.$http.get('/auth/encryptKey').then(resp => {
              let key = resp.headers.auth;
              this.credentials.password = Encrypt.AesEcbEncrypt(key, this.password);
              this.$http.post("/auth/reset/pwd",
                this.credentials,
                {params: {verifyCode: this.code}}).then(resp => {
                vIziToast.success('Reset password succeed!');
                this.isLoading = false;
              }).catch(err => {
                if (err.response) {
                  vIziToast.error(err.response.data.msg, 8000);
                  this.isLoading = false;
                }
              })
            }).catch(err => {
              console.log(err);
              this.isLoading = false;
            });
          } else {
            vIziToast.error('Reset form validation failed! Please check!');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      showCode() {
        this.show = !this.show;
      }
    },
    computed:{
      codeStyle(){
        if (this.errors.has('code')) {
          return {"margin-bottom":"0px"};
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./scss/login.scss";
  @import '../../assets/scss/validate.scss';

  #resetBtn {
    width: 100%;
    border-radius: 6px;
    font-size: 1.5rem; // font-style: italic;
    color: white;
  }

  // 注册-登录框背景
  #reset {
    @include make-user-box(45px 6% 30px 6%);
    padding-top: 25px;
  }

  .resetBtnCls span {
    color: #39bfd7;
  }
</style>
