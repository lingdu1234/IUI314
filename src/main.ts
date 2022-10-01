import './assets/css/main.scss';
import 'virtual:svg-icons-register';

import { createApp } from 'vue';

import App from './App.vue';
import { setupRoutes } from './router';
import { setupStores } from './stores';

const app = createApp(App);

setupRoutes(app);
setupStores(app);

app.mount('#app');
