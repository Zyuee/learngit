/**
 * TODO
 * @author houzhiwei
 * @date 2017/9/12 23:06
 */
import axios from "axios";
import router from "../router"; //添加响应拦截器
import iziToast from "izitoast";


let networkErrorInterceptor = axios.interceptors.response.use(
  response => {
    //对响应数据做些事
    return response;
  },
  error => {
    if (!error.response) {
      //Network Error
      console.log("Network Error");//undefined
      router.push({ path: '/404' ,query:{redirect:router.currentRoute.fullPath}});
    }
    else if (error.response.status==='403') {
      iziToast.error({
        title: 'Error',
        message: 'Session timeout, please login again!',
        position: 'center',
        layout: 2,
        timeout: 5000,
        toastOnce: true,
        buttons: [
          ['<button>Ok</button>', function( instance, toast ) {
            instance.hide({
              transitionOut: 'fadeOutUp',
              onClosing: function( instance, toast, closedBy ) {
                router.replace({ name: 'login' })
              }
            }, toast, 'close', 'btn1');
          }]
        ],
      });
    }
    //请求错误时做些事
    return Promise.reject(error);
  });

export default networkErrorInterceptor;
