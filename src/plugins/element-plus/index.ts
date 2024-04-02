import type { App } from 'vue'

import registerElement from './register'
export const setupElementPlus = (app: App) => {
  app.use(registerElement)
}
