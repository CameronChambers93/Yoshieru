import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

//Importing individual Material components
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
Vue.use(VueMaterial)

Vue.config.productionTip = false

//For easy custom dialog
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
Vue.use(VuejsDialog);

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
