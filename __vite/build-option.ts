import type { BuildOptions } from 'vite'

export function getBuild(): BuildOptions {
  return {
    sourcemap: false,
    minify: 'terser',
    outDir: './dist',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: (assetInfo: { name: string }) => {
          const name
                        = assetInfo.name.includes('.vue_vue_type_style_index_0_lang')
                        || assetInfo.name.includes('.vue_vue_type_script_setup_true_lang')
                        || assetInfo.name.includes('.vue_vue_type_script_setup_true_name')
                        || assetInfo.name.includes('.vue_vue_type_script_name')
                          ? assetInfo.name.split('.')[0]
                          : assetInfo.name
          return `assets/${name}-[hash].js`
        },
        manualChunks: {
          'echarts': ['echarts'],
          'vue-i18n': ['vue-i18n'],
          'vue-router': ['vue-router'],
          'svg-icon': ['virtual:svg-icons-register'],
        },
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
      },
    },
  }
}
