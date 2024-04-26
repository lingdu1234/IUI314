import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { en, zhCN } from './lang'

// import enUS from './lang/en.json'
// import zhCN from './lang/zh-CN.json'
import { useAppStore } from '@/stores'

export type MessageSchema = typeof en | typeof zhCN

const messages = {
  'zh-CN': { ...zhCN },
  'en-US': { ...en },
}

interface langInfo {
  k: string
  v: string
}

export const langList: langInfo[] = [
  {
    k: 'zh-CN',
    v: '简体中文',
  },
  {
    k: 'en-US',
    v: 'English',
  },
]
export function useSetupI18n() {
  const appStore = useAppStore()
  const i18n: any = createI18n<MessageSchema>({
    legacy: false,
    globalInjection: true,
    locale: appStore.app.lang || 'zhCN',
    fallbackLocale: 'zhCN',
    silentTranslationWarn: true,
    messages,
  })
  const setupI18n = (app: App) => {
    app.use(i18n)
  }

  return { i18n, setupI18n }
}
