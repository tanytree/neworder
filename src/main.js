import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import VueResource from 'vue-resource'
import FastClick from './js/fastclick'
import lodash from './js/lodash'
import store from './store'
require('./css/base.css')
require('./css/iconfont.css')
require('./css/style.css')
require('./js/rem')
FastClick.attach(document.body)
var infiniteScroll =  require('vue-infinite-scroll');
Vue.use(infiniteScroll)



//开启debug模式
Vue.config.debug = true;


Vue.use(VueRouter);
Vue.use(VueResource);


// 定义组件, 也可以像教程之前教的方法从别的文件引入


import home from './component/home.vue'
import orderdetail from './component/orderdetail.vue'
import mycart from './component/mycart.vue'
import itemdetail from './component/itemdetail.vue'
import search from './component/search.vue'
import orderconfirmation from './component/orderconfirmation.vue'
import orderlist from './component/orderlist.vue'


// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/home/:token/:company_id/:table_id/:sn/:oid',
      component: home
    },
    {
      path: '/itemdetail/:token/:company_id/:group_id/:item_id/:sn',
      component: itemdetail
    },
    {
      path: '/:token/orderdetail/',
      component: orderdetail
    },
    {
      path: '/mycart/:token/:company_id/:sn',
      component: mycart
    },
    {
      path: '/search/:token/:company_id/:sn',
      component: search
    },
    {
      path: '/orderconfirmation/:token/:company_id/:sn/:oid',
      component: orderconfirmation
    },
    {
      path: '/:token/orderlist/',
      component: orderlist
    }
  ],

})

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
const app = new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
