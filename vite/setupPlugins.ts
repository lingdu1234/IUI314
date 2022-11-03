import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer' //可视化显示文件大小
import DefineOptions from 'unplugin-vue-define-options/vite'
import type { PluginOption } from 'vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import {
  setupElementPlus,
  // setupAutoImport,
  setupHtmlPlugin,
  // setupImportCDN,
  setupSvgIcons,
  setupUnocss,
} from './plugins'

export const setupVitePlugins = (mode: string): PluginOption[] => {
  const vitePlugins = [
    vue(),
    vueJsx(),
    visualizer(),
    DefineOptions(),
    vueSetupExtend(),
    setupSvgIcons(),
    setupHtmlPlugin(mode),
    setupUnocss(),
    // setupImportCDN(),
    ...setupElementPlus(),
    // ...setupAutoImport(),
  ]
  return vitePlugins
}
