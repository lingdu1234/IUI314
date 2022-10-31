import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import { getViteEnv } from '../tools' //用于设置标题名称

export const setupHtmlPlugin = (mode: string): PluginOption => {
  return createHtmlPlugin({
    inject: {
      data: {
        title: getViteEnv(mode, 'VITE_APP_TITLE'),
      },
    },
  })
}
