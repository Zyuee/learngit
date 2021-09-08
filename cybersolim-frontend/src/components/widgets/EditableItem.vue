<!--
@author: houzhiwei
@date: 2018/7/14 14:4
@ref： https://www.haorooms.com/post/vue_vmodel
-->
<!--父组件-->
<!--<editable-item label="test" v-model="userForm.userOrganization" @save="saveEdit"></editable-item>-->
<template>
  <Form-item :label="label" class="editable-item">
    <Row>
      <Col span="18">
        <div v-show="!editing">{{value}}</div>
        <!--直接双向绑定，修改子组件值时，同时修改父组件内容-->
        <!--必须用原生的input结合iview的input组件的样式-->
        <input type="text" :value="value" v-show="editing" @input="$emit('editItem',$event.target.value)"
        class="ivu-input"></input>
      </Col>
      <Col span="3">
        <Button type="text" icon="md-create" @click="startEdit" :class="{inactive:editing,'show-edit-btn':!editing}"></Button>
        <Button type="text" icon="md-checkmark" v-show="editing" @click="saveEdit"></Button>
      </Col>
    </Row>
  </Form-item>
</template>

<script>
  export default {
    name: 'editable-item',
    data(){
      return {
        editing: false
      }
    },
    methods: {
      startEdit(){
        this.editing = true
      },
      saveEdit(){
        this.editing = false;

      }
    },
    model: {
    	prop:'value',
      event:'editItem'
    },
    props: {
      label: {
        type: String,
        required: false
      },
      // 获取 父组件 v-model 的值
      value: {
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>

  .show-edit-btn {
    display: none;
    margin-left: -10px;
  }

  .editable-item {
    .inactive {
      display: none;
    }
    &:hover .show-edit-btn {
      display: inline-block;
    }
  }


</style>
