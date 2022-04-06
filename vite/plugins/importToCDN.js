import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'

export default function createImportToCDN() {
    return importToCDN({
        modules: [
            // autoComplete('vue'),
            // {
            //     name: 'vue-demi',
            //     var: 'VueDemi',
            //     path: "lib/index.iife.min.js",
            // },
            {
                name: 'element-plus',
                var: 'ElementPlus',
                path: `https://unpkg.com/element-plus`,
                // css: 'https://unpkg.com/element-plus/dist/index.css',
            },
            // {
            //     name: 'md-editor-v3',
            //     var: 'md-editor-v3',
            //     path: `//cdn.jsdelivr.net/npm/md-editor-v3@1.11.5/lib/md-editor-v3.umd.js`,
            //     css:`//cdn.jsdelivr.net/npm/md-editor-v3@1.11.5/lib/style.css`
            // },
            // {
            //     name: 'echarts',
            //     var: 'echarts',
            //     path: `//lib.baomitu.com/echarts/latest/echarts.common.min.js`,
            // },
        ],
    })
}
