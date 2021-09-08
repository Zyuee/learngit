<template>
  <div class="content">
    <div id="bubbles">
      <bg-bubble></bg-bubble>
    </div>
    <Row type="flex" align="middle" justify="center" :gutter="20">
      <!--<Col id="left" :xs="0" :sm="12" :md="12" :lg="12">
        <Card id="des" props="bordered,shadow">
        </Card>
      </Col>-->
      <Col :xs="22" :sm="14" :md="14" :lg="14">
        <div class="register">
          <h1 class="text-center">Join EasyGC</h1>
          <Form role="form" :model="regForm" ref="regform" @submit.prevent="onSubmit">
            <!--E-mail-->
            <Row :gutter="20" type="flex" justify="start">
              <Col :xs="20" :sm="20" :md="20" :lg="20" offset="1">
                <validate-input label="E-mail address*" icon="md-mail"
                                :has-error="errors.has('email')" :error-msg="errors.first('email')"
                                :is-valid="veeFields.email && veeFields.email.valid">
                  <input type="text" v-model="regForm.userEmail" data-vv-validate-on="blur"
                         v-validate="'required|email|emailChecker'"
                         name="email" class="ivu-input" placeholder="your e-mail address"/>
                </validate-input>
              </Col>
            </Row>
            <!--User name-->
            <Row :gutter="5" type="flex" justify="start">
              <Col :xs="13" :sm="13" :md="13" :lg="13" offset="1">
                <validate-input label="User name" icon="md-person"
                                :has-error="errors.has('fname')" error-msg="2~15 letters/dashes">
                  <input type="text" v-model="regForm.userFirstName"
                         v-validate="{regex: /^[-_A-z\u4e00-\u9fa5]{2,15}$/}"
                         name="fname" class="ivu-input" placeholder="first name"/>
                  <!--2~15 letters/dashes-->
                </validate-input>
              </Col>
              <Col :xs="6" :sm="6" :md="6" :lg="6" offset="1">
                <validate-input icon="md-person"
                                :has-error="errors.has('lname')" error-msg="2~15 letters/dashes">
                  <input type="text" v-model="regForm.userLastName"
                         v-validate="{regex: /^[-_A-z\u4e00-\u9fa5]{2,15}$/}"
                         name="lname" class="ivu-input" placeholder="last name"/>
                </validate-input>
              </Col>
            </Row>
            <!--Password-->
            <Row :gutter="20" type="flex" justify="start">
              <Col :gutter="20" :xs="20" :sm="20" :md="20" :lg="20" offset="1">
                <validate-input label="Password*" icon="ios-lock"
                                :has-error="errors.has('password')" :error-msg="errors.first('password')"
                                :is-valid="veeFields.password && veeFields.password.valid">
                  <input type="password" v-model="password_input"
                         name="password" class="ivu-input" placeholder="password: minimum of 3 characters"/>
                </validate-input>
              </Col>
            </Row>
            <Row :gutter="20" type="flex" justify="start">
              <Col :xs="20" :sm="20" :md="20" :lg="20" offset="1">
                <validate-input label="Confirm Password*" icon="ios-lock"
                                :has-error="errors.has('password')" :error-msg="errors.first('password')"
                                :is-valid="veeFields.password && veeFields.password.valid">
                  <input type="password" name="password_confirm" v-model="password_confirm" class="ivu-input"
                         placeholder="password-again" ref="password_confirm" />
                </validate-input>
              </Col>
            </Row>
            <!--gender-->
            <Row :gutter="10" type="flex" justify="start">
              <Col :xs="13" :sm="13" :md="13" :lg="13" offset="1">
                <Form-item label="Salutation" :label-width="120" clearable>
                  <Select title="salutation" v-model="regForm.userSalutationId" name="salutation">
                    <Option v-for="(item,i) in salutations" :value="item.salutationId" :key="i">
                      {{item.salutationName }}
                    </Option>
                  </Select>
                </Form-item>
              </Col>
              <Col :xs="7" :sm="7" :md="7" :lg="7">
                <Form-item label="Gender" :label-width="60">
                  <Select title="gender" v-model="regForm.userGender" name="gender">
                    <Option v-for="item in genderData" :value="item.value" :key="item.value"> {{ item.label}}</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
            <!--Country / Region-->
            <Row :gutter="20" type="flex" justify="start">
              <Col :xs="20" :sm="20" :md="20" :lg="20" offset="1">
                <Form-item label="Country / Region" :label-width="120">
                  <Select data-live-search="true" placeholder="input to search and select" icon="earth" filterable
                          not-found-text="no data found" :remote="true" :remote-method="searchCountry"
                          :loading="searchLoading" loading-text="Searching..." clearable
                          v-model="regForm.userRegionId" class="form-control selectpicker show-tick" name="region">
                    <Option v-for="(item,i) in regions" :value="item.id" :key="i">{{item.nicename }}</Option>
                  </Select>
                </Form-item>
              </Col>
            </Row>
            <!--Research Field-->
            <Row :gutter="20" type="flex" justify="start">
              <Col :xs="20" :sm="20" :md="20" :lg="20" offset="1">
                <validate-input label="Research Field" icon="ios-book"
                                :has-error="errors.has('research')" :error-msg="errors.first('research')">
                  <input type="text" v-model="regForm.userResearchField"
                         v-validate="{regex: /^[-_A-z\u4e00-\u9fa5 ]{2,50}$/}"
                         name="research" class="ivu-input" placeholder="research field"/>
                </validate-input>
              </Col>
            </Row>
            <!--Submit-->
            <Row type="flex" justify="center">
              <Col :xs="24" :sm="24" :md="24" :lg="24" offset="1">
                <Form-item>
                  <Button class="resetbtn" type="warning" @click="reset">
                    Reset
                  </Button>
                  <!--@keyup.enter: vue 处理 回车键按下事件-->
                  <Button class="btn" type="primary" @click="onSubmit('regForm')" @keyup.enter.native="onSubmit('regForm')">
                    Sign up
                  </Button>
                </Form-item>
              </Col>
            </Row>
            <Row :gutter="20" type="flex" justify="center">
              <div class="change_link">
                Already a member ?
                <router-link to="/login" class="to_register">Go and log in</router-link>
              </div>
            </Row>
          </Form>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import BgBubble from '../widgets/Bg-Bubble'
  import ValidateInput from '../widgets/ValidateInput'
  import Encrypt from '../../js/auth/Encrypt'
  import { vIziToast } from '../../js/notify/v-iziToast'

  export default {
    $_veeValidate: {
      validator: 'new'
    }, // 创建一份新的验证器
    name: 'useRegister',
    data() {
      return {
        regForm: {
          userFirstName: '',
          userLastName: '',
          userEmail: '',
          userSalutationId: null,
          userGender: 0,
          userResearchField: '',
          userRegionId: null,
          userPassword: ''
        },
        password_input: '',
        password_confirm: '',
        salutations: [{ salutationId: -1, salutationName: '' }],
        regions: [],
        genderData: [
          {
            value: 0,
            label: 'Male'
          },
          {
            value: 1,
            label: 'Female'
          }],
        searchLoading: false // 远程搜索国家和地区时显示
      }
    },
    mounted () {
      this.$http.get('/rest/salutations').then(resp => {
        if (resp.data)
          this.salutations = resp.data;
        else
          console.log("resp:  "+resp);
      }).catch(err => {
        if (err.response) {
        	console.log("error:  "+err.response);
          vIziToast.error(err.response.message, 6000)
        }else{
        	// 不加"" 不会显示内容
          vIziToast.error(""+err, 6000,'center')
        }
      });
    },
    components: {
      BgBubble, ValidateInput
    },
    methods: {
      onSubmit() {
        // 提交之前执行验证
        this.$validator.validateAll().then(( result ) =>
        {
          if (result) {
            //加密。一般情况下使用Md5或Sha256对用户密码处理之后再post给后台就可以了
            //但因为原来已经写好了前后台AES加解密的代码，因此在这里还是使用AES加密之后再给后台解密，这样稍微安全一点
            this.$http.get('/auth/encryptKey').then(response => {
              let key = response.headers.auth;
              this.regForm.userPassword = Encrypt.AesEcbEncrypt(key, this.password_input);
              this.$auth.register({
                data: this.regForm,
                success: function( r ) {
//                  console.log(r);
                  vIziToast.success(r.data.msg);
                },
                error: function( err ) {vIziToast.error(err.response.data.msg)},
                autoLogin: false, //自动登录
                rememberMe: false,
                redirect: { name: 'login' }
              });
            }).catch(err => {
              vIziToast.error(err.response.data.msg)
//              console.log(err);
            });
          }
          else
            vIziToast.error('Register form validation failed! Please CHECK!');
        }).catch(() =>
        {
          console.log('Validation error');
        });
      },
      reset(){
        this.$validator.clear();
        for (let field in this.regForm) {
          this.regForm[field] = '';
          this.password_input = '';
          this.password_confirm = '';
        }
      },
      //远程搜索国家和地区
      searchCountry( value ){
        if (value!=='') {
          this.searchLoading = true;
          this.$http.get('/rest/regions/' + value).then(resp => {
            if (resp.data.data)
              this.regions = resp.data.data;
            this.searchLoading = false;
          });
        }
        else {
          this.regions = [];
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/layout.scss';
  @import '../../assets/scss/validate.scss';

  .ivu-form-item {
    margin-bottom: 16px;
  }

  $top: calc(50vh - 299px); // 垂直居中
  @include make-text-center(2rem, 10px);
  .register {
    margin-top: $top;
    @include make-user-box(15px);
    form.ivu-form {
      margin-top: 15px;
    }
  }

  $height: 598px;
  #des {
    height: $height;
    min-width: 300px;
    background-color: transparent;
    margin-top: $top;
  }

  $btn-font: 1rem;
  $btn-padding: 5px 0;
  .btn {
    width: 45%;
    font-size: $btn-font;
    padding: $btn-padding;
    &:hover {
      background: #5cadff;
    }
  }

  .resetbtn {
    width: 25%;
    font-size: $btn-font;
    padding: $btn-padding;
  }

  .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
</style>
