/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-11-03 21:47:37
 * @FilePath: \IUI314\vite.config.ts
 * @Description:
 */
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import { type ConfigEnv, defineConfig } from 'vite'

import { setupBuildOptions } from './vite/setupBuildOptions'
import { setupVitePlugins } from './vite/setupPlugins'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    plugins: [vue(), vueJsx(), Unocss(), ...setupVitePlugins(mode)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        //i18n
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    server: {
      port: 9876,
    },
    build: setupBuildOptions(),
    json: {
      // stringify: true,
    },
  })
