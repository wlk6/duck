import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import $ from 'jquery'
import './js/main';
import './js/libs';
import './js/dropzone'
import 'bootstrap';
import 'overlayscrollbars'
import  VueSelect  from 'vue-select';
import 'vue-select/dist/vue-select.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'bootstrap/dist/js/bootstrap.bundle'
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App);
app.config.globalProperties.$http = axios
app.use(router)
app.component('v-select', VueSelect)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app');
