import moment from 'moment'
import Vue from 'vue'

// 日期过滤器
Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD hh:mm')
    }
});