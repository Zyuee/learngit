<template>
  <j-panel :options="panelOptions" :show="show">
    <Form :model="userForm" class="profile-form">
      <Row type="flex" align="middle" justify="start">
        <Col span="7">
          <Card dis-hover :padding="0" class="avatar" :bordered=false>
            <img-inputer v-model="avatar" imgSrc="userForm.userPhoto" icon="img"
                         bottomText="drag an image or click to change"
                         placeholder="drag an image or click to change" theme="light"
                         accept="image/jpg,image/gif"
                         size="small"/>
          </Card>
        </Col>
        <Col span="16">
          <Row type="flex" justify="start">
            <i-col span="14">
              <Form-item label="Email" :label-width="60">
                <div>{{userForm.userEmail}}</div>
              </Form-item>
            </i-col>
            <i-col span="10">
              <Form-item label="Role" :label-width="60">
                <div>{{userForm.sysRole.roleName}}</div>
              </Form-item>
            </i-col>
          </Row>
          <Row :gutter="20" type="flex" justify="start">
            <i-col span="14">
              <Form-item label="Name" :label-width="60">
                <div class="label-text" v-show="!editing">{{userForm.userFirstName}}</div>
                <Input v-show="editing" autocomplete="off" v-model="userForm.userFirstName" type="text"
                       placeholder="first name"></Input>
              </Form-item>
            </i-col>
            <i-col span="10">
              <Form-item>
                <div class="label-text" v-show="!editing">{{userForm.userLastName}}</div>
                <Input v-show="editing" autocomplete="off" v-model="userForm.userLastName" type="text"
                       placeholder="last name"></Input>
              </Form-item>
            </i-col>
          </Row>
          <Row :gutter="20" justify="start">
            <i-col span="24">
              <Form-item label="Organization" :label-width="98">
                <div class="label-text" v-show="!editing">{{userForm.userOrganization}}</div>
                <Input v-show="editing" type="text" pattern="^[\w\d\s]{2,}$" v-model="userForm.userOrganization"
                       data-error="at least 2 characters" placeholder="your department"
                />
              </Form-item>
            </i-col>
          </Row>
        </Col>
      </Row>
      <Row :gutter="20" type="flex" justify="start">
        <Col span="14" offset="1">
          <Form-item label="Adress" :label-width="55">
            <div class="label-text" v-show="!editing">{{userForm.userCity}}</div>
            <Input v-show="editing" v-model="userForm.userCity" type="text" icon="android-locate" data-minlength="2"
                   data-error="at least 2 characters" placeholder="your city"
            ></Input>
          </Form-item>
        </Col>
        <Col span="8">
          <Form-item label="Gender" :label-width="60">
            <div class="label-text" v-show="!editing">{{userForm.userGender ? 'Male' : 'Female'}}</div>
            <Select v-show="editing" title="gender" v-model="userGender" name="gender">
              <Option v-for="item in genderData" :value="item.value" :key="item.value"> {{ item.label}}</Option>
            </Select>
          </Form-item>
        </Col>
      </Row>
      <Row :gutter="20" type="flex" justify="start">
        <Col span="20" offset="1">
          <Form-item label="Country/Region" :label-width="100">
            <div class="label-text" v-show="!editing">{{userForm.region.nicename}}</div>
            <Select v-show="editing" data-live-search="true" placeholder="input to search and select" icon="earth"
                    filterable
                    not-found-text="no data found" :remote="true" :remote-method="searchCountry"
                    :loading="searchLoading" loading-text="Searching..."
                    v-model="userForm.region.userRegionId" class="form-control selectpicker show-tick" name="region">
              <Option v-for="item in regions" :value="item.id" :key="item.id">{{item.nicename }}</Option>
            </Select>
          </Form-item>
        </Col>
      </Row>
      <Row type="flex" align="middle" justify="center">
        <Form-item>
          <Button class="btn" icon="md-create" @click="edit">{{!editing ? 'Start Edit' : 'Cancel Edit'}}</Button>
          <Button class="btn" icon="md-checkmark" type="primary" @click="save">Save</Button>
          <Button class="btn" icon="md-close" @click="closeThis">Close</Button>
        </Form-item>
      </Row>
    </Form>
  </j-panel>
</template>

<script>
  import { mapState } from 'vuex'
  import * as actionTypes from '../../store/action-types'
  import JPanel from '../widgets/JSPanel'
  import ImgInputer  from 'vue-img-inputer'
  import 'vue-img-inputer/dist/index.css'
  import { vIziToast } from '../../js/notify/v-iziToast'

  export default {
    name: 'user-profile',
    data() {
      return {
        // JSPanel 选项，不用设置content值
        panelOptions: {
          headerTitle: 'User Profile',
          theme: '#663399',
          contentSize: {
            width: 650,
            height: 310
          },
          headerControls: {
            maximize: 'remove' // 不允许最大
          },
          resizeit: false,
          onclosed: this.closeThis // 关闭jspanel面板事件
        },
        editing: false,
        avatar: {},
        regions: [],
        searchLoading: false,
        userGender: 1,
        genderData: [{ value: 0, label: 'Male' }, { value: 1, label: 'Female' }],
      }
    },
    computed: {
      ...mapState({
        show: state => state.UserState.showProfile
      }),
      userForm(){
        return this.$auth.user() || {};
      }
    },
    components: {
      JPanel, ImgInputer
    },
    methods: {
      closeThis() {
        this.editing = false;
        this.$store.dispatch(actionTypes.SHOW_USER_PROFILE, false);
      },
      save(){
        this.editing = false;
        //alert('save');
      },
      edit(){
        this.editing = !this.editing;
      },
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
      },
      changeAvatar(file,fileName){
          console.log(file);
          console.log(fileName);
      }
    }
  }
</script>

<style lang="scss">
  .ivu-form-item {
    margin-bottom: 16px;
  }

  .btn {
    margin-right: 15px;
  }

  .edit-div {
    width: 164px;
  }

  .profile-form {
    padding: 12px;
  }

  .avatar {
    width: 100%;
    height: 132px;
  }

  .img-inputer--small {
    height: 128px !important;
    width: 152px !important;
  }

  .label-text {
    border-bottom: .5px #d2d4daf7 dashed
  }
</style>
