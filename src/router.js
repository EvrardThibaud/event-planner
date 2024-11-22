import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import AboutUs from './views/AboutUs.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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

