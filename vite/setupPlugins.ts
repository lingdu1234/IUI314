import { visualizer } from 'rollup-plugin-visualizer' //可视化显示文件大小
import DefineOptions from 'unplugin-vue-define-options/vite'
import type { PluginOption } from 'vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import {
  // setupElementPlus,
  // setupAutoImport,
  setupHtmlPlugin,
  setupImportCDN,
  setupSvgIcons,
} from './plugins'

export const setupVitePlugins = (mode: string): PluginOption[] => {
  const vitePlugins = [
    visualizer(),
    DefineOptions(),
    vueSetupExtend(),
    setupSvgIcons(),
    setupHtmlPlugin(mode),
    setupImportCDN(),
    // ...setupElementPlus(),
    // ...setupAutoImport(),
  ]
  return vitePlugins
}
