import {} from './base'

import { createApp } from 'vue'
import App from '../components/App.vue'

globalThis.__VUE_OPTIONS_API__ = true
globalThis.__VUE_PROD_DEVTOOLS__ = true;

import { VueReCaptcha } from 'vue-recaptcha-v3'

import config from "../config.json";

createApp(App).use(VueReCaptcha, { siteKey: config.recaptchaSiteKey }).mount('#app')
