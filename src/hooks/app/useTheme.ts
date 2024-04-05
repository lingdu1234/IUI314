import { useColorMode, usePreferredDark } from '@vueuse/core'

import { useAppStore } from '@/stores'

export function useTheme() {
  const appStore = useAppStore()

  const mode = useColorMode()

  const theme_list: string[] = [
    'light',
    'dark',
    'userConfig',
  ]

  const set_dark = () => {
    document.body.setAttribute('arco-theme', 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', '#232323')
    mode.value = 'dark'
  }
  const set_light = () => {
    document.body.removeAttribute('arco-theme')
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', '#FAFAFA')
    mode.value = 'light'
  }
  const get_is_dark = () => {
    if (appStore.app.isDark)
      return true
    return appStore.app.isDark === undefined && usePreferredDark().value
  }
  const init_theme = () => {
    if (get_is_dark())
      set_dark()
    else
      set_light()
  }
  function set_theme(theme: string) {
    appStore.app.theme = theme
    if (theme === 'light') {
      set_light()
      appStore.app.isDark = false
    }
    else {
      set_dark()
      appStore.app.isDark = true
    }
  }
  return {
    theme_list,
    set_dark,
    set_light,
    init_theme,
    set_theme,
    get_is_dark,
  }
}
