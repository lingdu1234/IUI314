/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-09-30 18:41:35
 * @LastEditors: lingdu waong2005@126.com
 * @LastEditTime: 2022-10-29 09:47:02
 * @FilePath: \IUI314\vite.config.ts
 * @Description:
 */
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer' //可视化显示文件大小
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { type ConfigEnv, defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html' //用于设置标题名称
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend' //为setup  主要用于定义名称;

const getViteEnv = (mode: string, target: string) => {
  return loadEnv(mode, process.cwd())[target]
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      visualizer(),
      vueSetupExtend(),
      DefineOptions(),
      Unocss(),
      ElementPlus({
        useSource: true,
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [
          fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
        ],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: getViteEnv(mode, 'VITE_APP_TITLE'),
          },
        },
      }),
    ],
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
    build: {
      sourcemap: false,
      minify: 'terser',
      outDir: './dist',
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('index.html', import.meta.url)),
        },
        output: {
          // 入口文件名
          entryFileNames: 'assets/[name].js',
          // 块文件名
          chunkFileNames: 'assets/[name]-[hash].js',
          // 资源文件名 css 图片等等
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // manualChunks(id) {
          //   if (id.includes('node_modules')) {
          //     return id
          //       .toString()
          //       .split('node_modules/')[1]
          //       .split('/')[0]
          //       .toString()
          //   }
          // },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        sourceMap: false,
        format: {
          comments: false,
          // quote_style: 1,
          // 会导致程序无法启动
        },
      },
    },
  })
