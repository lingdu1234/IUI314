/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\main.ts
 * @Description: main
 */
import './assets/css/main.scss'
import 'virtual:svg-icons-register'
import 'uno.css'

import { createApp } from 'vue'

import { useSetupI18n } from '@/i18n'
import { setupRoutes } from '@/router'
import { setupStores } from '@/stores'

import App from './App.vue'
import { setupElementPlus } from './plugins'

const bootApp = async () => {
  const app = createApp(App)

  setupStores(app)
  await setupRoutes(app)
  useSetupI18n().setupI18n(app)
  setupElementPlus(app)
  app.mount('#app')
}

bootApp()
