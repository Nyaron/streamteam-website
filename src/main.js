import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

window.eventBus = new Vue();

const ogApp = new Vue({
  router,
  components: { App },
  template: '<App/>',
});

ogApp.$mount('#app');
