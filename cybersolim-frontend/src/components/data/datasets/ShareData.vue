<template>
  <transition name="slide-up">
    <j-panel :options="panelOption" :show="showShare" class="data-form">
      {{dataType}} <i>{{dataName}}</i> will be shared to:

      <Form :model="shareForm">
        <RadioGroup @on-change="findUserGroups" v-model="shareForm.toType">
          <Radio label="User"></Radio>
          <Radio label="Group"></Radio>
        </RadioGroup>
        <Form-item v-if="shareForm.toType==='User'" label="email" :label-width="70">
          <Input v-model="shareForm.email" placeholder="Email of the user you want to share to"></Input>
        </Form-item>
        <Form-item v-if="shareForm.toType==='Group'" label="group name" :label-width="100">
          <Select v-model="shareForm.toId" placeholder="Select a group to share">
            <Option v-for="item of this.myGroups" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Form-item>
        <Form-item>
          <Button icon="md-checkmark" type="primary" @click="shareButton">Share</Button>
          <Button icon="md-close" @click="closeThis">Cancel</Button>
        </Form-item>
      </Form>

    </j-panel>
  </transition>
</template>

<script>
import JPanel from '../../widgets/JSPanel'
import { vIziToast } from '../../../js/notify/v-iziToast'
import {mapState} from 'vuex'
import * as actionTypes from '@/store/action-types'
export default {
  name: 'data-share',
  data() {
    return {
      panelOption: {
        id: 'share_data',
        paneltype: 'modal',
        theme: "default",
        headerTitle: 'Share Data',
        draggable: true,
        headerControls: {maximize: "remove"},
        contentSize: {
          width: 400,
          height: 155
        },
        onclosed: this.closeThis,
        resizeit:false
      },
      shareForm:{
        toType:'', // User=1 Group=2
        dataId:0,
        toId:0,
        email:'',
      },
      toTypeMap:{
        User:1,
        Group:2
      },
      myGroups:null,
    }
  },
  components: { JPanel },
  methods: {
    closeThis() {
      this.$emit('close');
    },
    shareButton(){
      let that = this;
      if(this.shareForm.toType==='User'){
        this.axios({//先寻找用户
          url:'/auth/find',
          method:'GET',
          params: {
            email:this.shareForm.email,
          }
        }).then(response=>{
          if(!response.data.data){
            vIziToast.error('user not found',2000);
            return false;
          }
          that.shareForm.toId=response.data.data;
          this.share();
        })
      }else if(this.shareForm.toType==='Group'){
        this.share();
      }

    },
    findUserGroups(toType){
      if(toType==='User'){
        return;
      }
      this.axios({//找到用户后
        url:'/group/groupsBasicInfo',
        method:'GET',
      }).then(response=>{
        if(response.status!==200){
          vIziToast.error(response.data.msg,1000);
          return false;
        }
        this.myGroups = response.data
        console.log(this.myGroups)
      })
    },
    share(){
      if(this.dataType==='dataset'){ //如果是分项数据集
        this.shareDataset();
      }else if(this.dataType==='file'){ //如果是分项文件
        this.shareFile();
      }
    },
    shareDataset(){
      this.axios({//找到用户后
        url:'/share/'+this.dataType+'Invitation',
        method:'POST',
        params: {
          datasetId:this.dataId,
          subscriberId:this.shareForm.toId,
          subscriberTypeId:this.toTypeMap[this.shareForm.toType]
        }
      }).then(response=>{
        if(response.status!==200){
          vIziToast.error(response.data.msg,8000);
          return false;
        }else if(response.data.status !== 'OK'){
          vIziToast.info(response.data.msg,8000);
          return false;
        }
        vIziToast.success('share dataset success',1000);
      })
    },
    shareFile(){
      this.axios({//找到用户后
        url:'/share/'+this.dataType+'Invitation',
        method:'POST',
        params: {
          fileId:this.dataId,
          fileTypeId:this.fileTypeId,
          subscriberId:this.shareForm.toId,
          subscriberTypeId:this.toTypeMap[this.shareForm.toType]
        }
      }).then(response=>{
        console.log(response)
        if(response.status!==200){
          vIziToast.error(response.data.msg,8000);
          return false;
        }else if(response.data.status !== 'OK'){
          vIziToast.info(response.data.msg,8000);
          return false;
        }
        vIziToast.success('share file success',2000);
      })

    },
  },
  computed: {
    showShare() {
      return this.show;
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    dataId: {
      type: Number,
      required: true,
    },
    dataName: {
      type: String,
      required: true,
      default: ''
    },
    dataType: {
      type: String,
      required: true,
      default: 'dataset'
    },
    fileTypeId:{
      type: Number,
      required:false,
      default:0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/data-create.scss";
</style>
