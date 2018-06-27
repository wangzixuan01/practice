import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const E1 = resolve => {
  require.ensure([], () => {
    resolve(require('../components/experiment/work.vue'));
  });
};

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/'
    },
    {
      path: '/',
      component: E1
    }
  ]
});
