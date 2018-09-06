import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Streamer from '@/components/Streamer';
import StreamerHome from '@/components/StreamerHome';
import StreamerSchedule from '@/components/StreamerSchedule';
import StreamerAbout from '@/components/StreamerAbout';

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
      component: Streamer,
      children: [
        {
          path: '',
          component: StreamerHome,
          name: 'streamer-home',
        },
        {
          path: 'schedule',
          component: StreamerSchedule,
          name: 'schedule',
        },
        {
          path: 'about',
          component: StreamerAbout,
          name: 'about',
        },
      ],
    },
  ],
});
