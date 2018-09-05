import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Streamer from '@/components/Streamer';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/streamer/:channel',
      name: 'streamer',
      component: Streamer,
      children: [
        {
          path: 'schedule',
          name: 'schedule',
        },
        {
          path: 'about',
          name: 'about',
        },
      ],
    },
  ],
});
