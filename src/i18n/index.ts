/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-21 14:33:39
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\i18n\index.ts
 * @Description:
 */
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { useAppStore } from '@/stores'

import enUS from './lang/en-US.json'
import zhCN from './lang/zh-CN.json'

export type MessageSchema = typeof enUS | typeof zhCN

const messages = {
  'zh-CN': { ...zhCN },
  'en-US': { ...enUS },
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

export const useSetupI18n = () => {
  const appStore = useAppStore()
  const i18n = createI18n<MessageSchema>({
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
