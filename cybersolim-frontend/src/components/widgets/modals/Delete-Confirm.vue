<!--
houzhiwei
2017/6/1 16:20
删除确认框
-->
<template>
  <Modal v-model="modal" :closable="true" :mask-closable="false" class="warning-modal" width="380"
         class-name="modal-style">
    <p slot="header">
      <Icon type="md-notifications-outline" />
      <span>Careful Delete</span>
    </p>
    <span slot="close" @click="cancel">
      <Icon type="close" color="white"></Icon>
    </span>
    <div class="modal-info">
      <Row>
        <i-col span="3">
          <Icon type="md-alert" size="40" color="#c06767"></Icon>
        </i-col>
        <i-col span="21">
          <p>Selection(s) will be deleted and can not be recovered! Are you sure to do this?</p>
        </i-col>
      </Row>
    </div>
    <div slot="footer" class="modal-footer">
      <Button type="info" class="error" icon="md-remove" :loading="deleting" @click="ok">Yes, delete</Button>
      <Button icon="md-close" @click="cancel">Cancel</Button>
    </div>
  </Modal>
</template>

<script>

  export default {
    name: 'delete-confirm',
    data(){
      return {}
    },
    components: {},
    methods: {
      ok () {

//        this.$Message.info('点击了确定');
        this.$emit('yes');//触发父组件方法

      },
      cancel () {
        this.$Message.info('Deletion canceled!');
        this.$emit('cancel');//触发父组件方法
      }
    },
    computed: {
      modal (){
        return this.delModal;
      }
    },
    props: {
      delModal: {
        type: Boolean,
        default: false,
        required: true
      },
      deleting: {
        type: Boolean,
        default: false
      },
    }
  }
</script>

<style lang="scss">
  $danger-color: rgb(209, 99, 99);
  .error {
    &:hover{
      background-color: $danger-color;
      color: yellow;
      border-color:  $danger-color;
      font-size: larger;
      transition: .2s;
    }
  }

  .ivu-modal-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 7px 16px;
    background-color: $danger-color;
    font-variant-caps: small-caps;
    p {
      color: #ffffff;
      font-weight: normal;
    }
  }

  .modal-style {
    position: fixed;;
    top: 50%;
    margin-top: -150px;
  }

  .ivu-modal-body {
    padding: 0;
  }

  .ivu-modal-footer {
    padding: 6px 8px;
    text-align: right;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .modal-info {
    height: 65px;
    text-align: center;
    padding: 10px 16px 12px 20px;
    p {
      font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: larger;
      font-weight: 500;
      text-align: left;
      padding-left: 15px;
    }
  }
</style>
