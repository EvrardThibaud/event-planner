import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import AboutUs from './views/AboutUs.vue';
import Calendar from './views/Calendar.vue';
import Event from './views/Event.vue';
import Chat from './views/Chat.vue';
import ContactUs from './views/ContactUs.vue';
import GoogleAuth from './views/GoogleAuth.vue';

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
    path: '/event',
    name: 'Event',
    component: Event,
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
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, 
});

