import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  if (to.meta.requiresAuth && !loggedIn) {
    // If route requires auth and user is not logged in, redirect to login.
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Register') && loggedIn) {
    // If user is logged in and tries to access Login or Register, redirect to home.
    next('/');
  } else {
    next();
  }
});

export default router;
