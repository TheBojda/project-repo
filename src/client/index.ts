import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import '@fortawesome/fontawesome-free/css/all.css'

import "firebaseui/dist/firebaseui.css";

import "leaflet/dist/leaflet.css"

import { createSSRApp } from 'vue'
import App from '../components/App.vue'

globalThis.__VUE_OPTIONS_API__ = true
globalThis.__VUE_PROD_DEVTOOLS__ = true;

createSSRApp(App).mount('#app')
