import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkSquareAlt, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import 'firebase/firestore';
import App from './App';
import router from './router';

Vue.use(VueFire);
firebase.initializeApp({
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
});

const db = firebase.firestore();
const settings = {
  timestampsInSnapshots: true,
};
db.settings(settings);
export { db as default };

window.eventBus = new Vue();

library.add(fab, faExternalLinkSquareAlt, faStar, faCheckCircle);

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
