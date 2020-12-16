import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

import Welcome from '../components/Welcome'
import Home from '../components/Home'
import Shows from '../components/Shows'
import Friends from '../components/Friends'
import Profile from '../components/Profile'

Vue.use(VueRouter)

const routes = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
    meta: {
      requiresNotAuth: true
    }
  },
  {
    path: "*",
    redirect: '/'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shows',
    name: 'Shows',
    component: Shows,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: Friends,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // Page requires authentication
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
    } else {
      next('/welcome')
    }
  // Page requires not being authenticated
  } else if(to.matched.some(record => record.meta.requiresNotAuth)) {
    if (!store.getters.isLoggedIn) {
      next()
    } else {
      next('/')
    }
  // Normal page
  } else {
    next()
  }
})

export default router
