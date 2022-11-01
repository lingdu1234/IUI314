import ElementPlus from 'unplugin-element-plus/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'

export const setupElementPlus = (): PluginOption[] => {
  return [
    ElementPlus({
      useSource: true,
    }),
    Components({
      // resolvers: [ElementPlusResolver()],
    }),
  ]
}
