import { useColorMode, usePreferredColorScheme, usePreferredDark } from '@vueuse/core'

import { useAppStore } from '@/stores'

export const theme_list: string[] = [
  'system',
  'light',
  'dark',
  'userConfig',
]

export function useTheme() {
  const appStore = useAppStore()

  const mode = useColorMode()
  const colorScheme = usePreferredColorScheme()

  const set_dark = () => {
    document.body.setAttribute('arco-theme', 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', '#232323')
    mode.value = 'dark'
    appStore.app.isDark = true
  }
  const set_light = () => {
    document.body.removeAttribute('arco-theme')
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', '#FAFAFA')
    mode.value = 'light'
    appStore.app.isDark = false
  }
  const get_is_dark = () => {
    if (appStore.app.isDark)
      return true
    return appStore.app.isDark === undefined && usePreferredDark().value
  }
  const init_theme = () => {
    if (appStore.app.theme === 'system') {
      switch (colorScheme.value) {
        case 'light':
          set_light()
          appStore.app.isDark = 'auto'
          break
        case 'dark':
          set_dark()
          break
        default:
          set_light()
          break
      }
    }
    else {
      if (get_is_dark())
        set_dark()
      else
        set_light()
    }
  }
  function set_theme(theme: (typeof theme_list)[number]) {
    appStore.app.theme = theme
    switch (theme) {
      case 'system':
        init_theme()
        break
      case 'light':
        set_light()
        break
      case 'dark':
        set_dark()
        break
      default:
        init_theme()
        break
    }
  }
  return {
    theme_list,
    init_theme,
    set_theme,
    get_is_dark,
  }
}
