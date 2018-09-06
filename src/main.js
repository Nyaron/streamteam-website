import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import App from './App';
import router from './router';

window.eventBus = new Vue();

library.add(fab, faExternalLinkSquareAlt);

Vue.config.productionTip = false;

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  const result = value.toString();
  return result.charAt(0).toUpperCase() + result.slice(1);
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

const ogApp = new Vue({
  router,
  components: { App },
  template: '<App/>',
});

ogApp.$mount('#app');
