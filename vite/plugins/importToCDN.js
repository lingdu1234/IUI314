import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'

export default function createImportToCDN() {
    return importToCDN({
        modules: [
            autoComplete('vue'),
            autoComplete('axios'),
            autoComplete('file-saver'),
            {
                name: 'vue-demi',
                var: 'VueDemi',
                path: "lib/index.iife.min.js",
            },
            {
                name: 'vuex',
                var: 'Vuex',
                path: "dist/vuex.global.min.js",
            },
            {
                name: 'vue-router',
                var: 'VueRouter',
                path: "dist/vue-router.global.min.js",
            },
            {
                name: 'element-plus',
                var: 'ElementPlus',
                path: `dist/index.full.min.js`,
                css: 'dist/index.css',
            },
            {
                name: '@element-plus/icons-vue',
                var: 'ElementPlusIconsVue',
                path: `dist/index.iife.min.js`,
            },
            {
                name: 'md-editor-v3',
                var: 'MdEditorV3',
                path: `lib/md-editor-v3.umd.js`,
                css:`lib/style.css`
            },
            {
                name: 'echarts',
                var: 'echarts',
                path: `dist/echarts.min.js`,
            },
        ],
    })
}
