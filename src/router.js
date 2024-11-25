import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import AboutUs from './views/AboutUs.vue';
import Calendar from './views/Calendar.vue';
import Chat from './views/Chat.vue';
import ContactUs from './views/ContactUs.vue';
import GoogleAuth from './views/GoogleAuth.vue';
import Error404 from './views/Error404.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: ContactUs,
  },
  {
    path: '/google',
    name: 'GoogleAuth',
    component: GoogleAuth,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs,
  },
  {
    path: '/:catchAll(.*)',  // Cette route attrape toutes les autres URLs
    name: 'Error404',
    component: Error404,
  }
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, 
});

