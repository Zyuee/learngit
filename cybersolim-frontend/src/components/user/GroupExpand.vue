<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
              <span class="expand-key">Create time:  </span>
              <span class="expand-value">{{ date }}</span>
            </Col>
            <Col span="8">
              <span class="expand-key">Description: </span>
              <span class="expand-value">{{ row.groupDescription }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
  import moment from 'moment'

	export default {
		props: {
			row: Object
		},
    computed:{
			date(){
       return moment(this.row.groupCreateTime).format("YYYY:MM:DD hh:mm:ss")
      }
    }
	};
</script>
<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>
