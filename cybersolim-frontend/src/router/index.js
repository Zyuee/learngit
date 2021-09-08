import Vue from "vue";
import VueRouter from "vue-router";

// 懒加载 https://router.vuejs.org/zh-cn/advanced/lazy-loading.html
// const Index = resolve => require(['@/components/Index'], resolve);
// const Login = r => require(['@/components/user/Login'], r); // r = resolve
const Home = () => import('@/Home');
const Index = () => import('@/components/Index');
const Login = () => import('@/components/user/Login'); // r = resolve
const Register = () => import('@/components/user/Register');
const ResetPassword = () => import('@/components/user/ResetPassword');
const AcceptDataset = () => import('@/components/data/datasets/AcceptDataset');
const AcceptFile = () => import('@/components/data/datasets/AcceptFile');
const NotFound = () => import('@/components/errors/404');
const NotAuthorized = () => import('@/components/errors/403');
// import Index from '@/components/Index' // 一般写法

Vue.use(VueRouter);

// Vue 前端路由
// vue-auth插件的配置：auth: false 表示用户登录之后，用户不可以再访问
const router = new VueRouter({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'hello',
      // redirect:'/login'
      component: Home,
      meta: {auth: false}
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: { auth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { auth: false },
      redirect:'/'
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { auth: false }
    }, {
      path: '/reset',
      name: 'reset',
      component: ResetPassword,
      meta: { auth: false }
    },{
      path: '/accept-dataset',
      name: 'accept-dataset',
      component: AcceptDataset,
      meta: { auth: true }
    },{
      path: '/accept-file',
      name: 'accept-file',
      component: AcceptFile,
      meta: { auth: true }
    },{
      path: '/404',
      name: '404',
      component: NotFound,
      meta: { auth: false }
    }, {
      path: '/403',
      name: '403',
      component: NotAuthorized,
      meta: { auth: false }
    },
    { path: '*', component: NotFound }]
});

export default router;
