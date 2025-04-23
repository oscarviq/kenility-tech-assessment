import { NavigationGuard, createRouter, createWebHistory } from 'vue-router';

// Views
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

type GuardParams = {
  redirectTo: string;
};

// Guards
export const isAnonymous = ({ redirectTo }: GuardParams): NavigationGuard => {
  return async (to, from, next) => {
    const session = localStorage.getItem('accessToken');

    if (!session) {
      next({ name: redirectTo });
    } else {
      next(true);
    }
  };
};

export const hasSession = ({ redirectTo }: GuardParams): NavigationGuard => {
  return async (to, from, next) => {
    const session = localStorage.getItem('accessToken');
    if (session) {
      next({ name: redirectTo });
    } else {
      next(true);
    }
  };
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      component: HomeView,
      beforeEnter: isAnonymous({ redirectTo: 'login' })
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: hasSession({ redirectTo: 'home' })
    }
  ],
});

export default router;
