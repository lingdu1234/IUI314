import path from 'node:path'

// import { fileURLToPath, URL } from 'node:url'
import type { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export const setupSvgIcons = (): PluginOption => {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
  })
}
