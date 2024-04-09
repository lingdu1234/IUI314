import { URL, fileURLToPath } from 'node:url'

import { type ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) =>
  defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      UnoCSS(),
      visualizer(),
      // vueSetupExtend(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      vitePluginForArco({
        style: 'css',
      }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-i18n'],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: getViteEnv(mode, 'VITE_APP_TITLE'),
          },
        },
      }),
      // cdn({
      //   modules: ['vue', 'vue-demi', 'vue-router', 'pinia'],
      //   apply: command,
      //   resolve: cdnjs(),
      // }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // i18n
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9876,
      // open: true,
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      outDir: './dist',
      cssCodeSplit: true,
      rollupOptions: {
        //   input: {
        //     index: fileURLToPath(new URL('../index.html', import.meta.url)),
        //   },
        output: {
          // 入口文件名
          // entryFileNames: 'assets/[name].js',
          // 块文件名
          // chunkFileNames: 'assets/[name]-[hash].js',
          // 资源文件名 css 图片等等
          // assetFileNames: 'assets/[name]-[hash].[ext]',
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
    json: {
      // stringify: true,
    },
  })

function getViteEnv(mode: string, target: string) {
  return loadEnv(mode, import.meta.url)[target]
}
