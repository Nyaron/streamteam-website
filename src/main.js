import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  const result = value.toString();
  return result.charAt(0).toUpperCase() + result.slice(1);
});

window.eventBus = new Vue();

const ogApp = new Vue({
  router,
  components: { App },
  template: '<App/>',
});

ogApp.$mount('#app');
