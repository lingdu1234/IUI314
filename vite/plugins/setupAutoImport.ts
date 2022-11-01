import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { PluginOption } from 'vite'

export const setupAutoImport = (): PluginOption[] => {
  return [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
  ]
}
