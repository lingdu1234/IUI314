/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 19:06:06
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-03 23:17:37
 * @FilePath: \IUI314\src\stores\index.ts
 * @Description:
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export const setupStores = (app: App) => {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  app.use(store)
}

export * from './modules'
