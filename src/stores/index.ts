import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export function setupStores(app: App) {
  const store = createPinia()
  store.use(piniaPluginPersistedstate)
  app.use(store)
}

export * from './modules'
