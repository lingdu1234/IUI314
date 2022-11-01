import type { PluginOption } from 'vite'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'

export const setupImportCDN = (): PluginOption => {
  return importToCDN({
    prodUrl: '//cdn.jsdelivr.net/npm/{name}@{version}/{path}',
    modules: [
      autoComplete('vue'),
      {
        name: 'vue-demi',
        var: 'VueDemi',
        path: 'lib/index.iife.js',
      },
      {
        name: 'vue-router',
        var: 'VueRouter',
        path: 'dist/vue-router.global.prod.js',
      },
      {
        name: 'jsencrypt',
        var: 'JSEncrypt',
        path: 'bin/jsencrypt.min.js',
      },
      {
        name: 'element-plus',
        var: 'ElementPlus',
        path: 'dist/index.full.min.js',
        css: 'dist/index.css',
      },
      {
        name: 'echarts',
        var: 'echarts',
        path: 'dist/echarts.min.js',
      },
      {
        name: 'vue-echarts',
        var: 'VueECharts',
        path: 'dist/index.umd.min.js',
      },
      {
        name: 'vue-cropper',
        var: 'VueCropper',
        path: 'dist/vue-cropper.umd.js',
        css: 'dist/index.css',
      },
      {
        name: 'event-source-polyfill',
        var: 'EventSourcePolyfill',
        path: 'src/eventsource.min.js',
      },
      {
        name: 'vue-i18n',
        var: 'VueI18n',
        path: 'dist/vue-i18n.global.prod.js',
      },
      //   {
      //     name: 'mitt',
      //     var: 'mitt',
      //     path: 'dist/mitt.min.js',
      //   },
    ],
  })
}
