import Unocss from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer' //可视化显示文件大小
import DefineOptions from 'unplugin-vue-define-options/vite'
import type { Plugin, PluginOption } from 'vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import {
  // setupElementPlus,
  // setupAutoImport,
  setupHtmlPlugin,
  setupImportCDN,
  setupSvgIcons,
} from './plugins'

type vitePlugin = PluginOption | Plugin

export const setupVitePlugins = (mode: string): vitePlugin[] => {
  const vitePlugins: vitePlugin[] = [
    vue(),
    vueJsx(),
    Unocss(),
    visualizer() as Plugin,
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
