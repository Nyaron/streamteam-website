import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store.js';

import Home from './views/Home.vue';
import Streamer from './views/Streamer';
import StreamerHome from './views/StreamerHome';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/streamer/:channel',
      component: Streamer,
      children: [
        {
          path: '',
          name: 'streamer-home',
          component: StreamerHome,
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('./views/StreamerSchedule.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('./views/StreamerAbout.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: {
        authRequired: true,
      },
      children: [
        {
          path: 'stats',
          name: 'dashboard-stats',
          component: () => import('./views/DashboardStats.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
