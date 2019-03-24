import Vue from 'vue';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkSquareAlt, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router';
import store from './store';

library.add(fab, faExternalLinkSquareAlt, faStar, faCheckCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.filter('capitalize', value => {
  if (!value) return '';
  const result = value.toString();
  return result.charAt(0).toUpperCase() + result.slice(1);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
