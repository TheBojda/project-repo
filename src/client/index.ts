import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import "firebaseui/dist/firebaseui.css";

import { createSSRApp } from 'vue'
import App from '../components/App.vue'

globalThis.__VUE_OPTIONS_API__ = true
globalThis.__VUE_PROD_DEVTOOLS__ = true;

createSSRApp(App).mount('#app')
