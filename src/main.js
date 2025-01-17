import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.baseURL = require('./config/config').backendURL;
const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
  axios.defaults.headers.common['authorization'] = "Bearer " + jwtToken
}

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')