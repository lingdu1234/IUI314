import { createApp } from 'vue'

import App from './App.vue'
import { setupElementPlus } from './plugins'
import { useSetupI18n } from '@/i18n'
import { setupRoutes } from '@/router'
import { setupStores } from '@/stores'

import 'nprogress/nprogress.css'
import './assets/css/main.scss'
import 'uno.css'
import 'virtual:svg-icons-register'
import '@arco-design/web-vue/dist/arco.css'

async function bootApp() {
  const app = createApp(App)
  setupStores(app)
  await setupRoutes(app)
  useSetupI18n().setupI18n(app)
  setupElementPlus(app)
  // setupAcroDesignVue(app)
  app.mount('#app')
}

void bootApp()
