import { defineConfig } from 'unocss'
import presetUno from 'unocss/preset-uno'

export default defineConfig({
  content: {
    pipeline: {
      exclude: [
        'node_modules',
        'dist',
        '.git',
        'public',
        'build',
        './stats.html',
      ],
    },
  },
  presets: [presetUno()],
  shortcuts: {},
  theme: {
    colors: {},
  },
})
