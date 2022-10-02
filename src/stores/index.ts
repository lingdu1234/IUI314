import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export const setupStores = (app: App) => {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  app.use(store)
}

export * from './app'
export * from './test'
