<template>
<div>activate file !</div>
</template>

<script>
import axios from "axios";
import {vIziToast} from "../../../js/notify/v-iziToast";
export default {
  name: 'accept-file',
  data(){return {}},
  created(){
    console.log(this.$route.query.code)
    axios({//找到用户后
      url:'/share/acceptFile',
      method:'POST',
      params: {
        code:this.$route.query.code
      }
    }).then(response=>{
      console.log(response)
      if(response.status!==200 || response.data.status!=='OK'){
        vIziToast.error(response.data.msg,8000);
        return false;
      }
      vIziToast.success('subscribe success',5000);
      this.$router.push('/index')
    })
  }
}

</script>

<style lang="scss" scoped>

</style>
