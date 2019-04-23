import Vue from 'vue';
import Router from 'vue-router';
import Layout from './wrapper/Layout.vue';
import routes from './wrapper/router';
import store from './wrapper/store';
import * as utils from '@/common/utils';

// util.js是通过store来传入,还是window.super.util
Vue.config.productionTip = false;

Vue.prototype.$utils = utils;

window.$utils = utils;

Vue.use(Router);

const router = new Router({
  routes,
});
router.beforeEach((from: any, to: any, next: any) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
new Vue({
  router,
  store, // 此处考虑模块的动态按需加载
  render: h => h(Layout),
}).$mount('#app');
