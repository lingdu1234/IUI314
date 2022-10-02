import { useColorMode, useCycleList } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, watch } from 'vue'

import { useAppStore } from '@/stores'

export const useTheme = () => {
  const appStore = useAppStore()
  const colorMode = useColorMode({
    emitAuto: true,
    modes: {
      classic: 'classic',
      pink: 'pink',
      gray: 'gray',
    },
  })

  const theme_list: string[] = ['light', 'dark', 'classic', 'pink', 'gray']
  const theme_map: Record<string, string> = {
    light: '亮色',
    dark: '黑暗',
    classic: '经典',
    pink: '粉色',
    gray: '灰色',
  }

  const { next: nextColor } = useCycleList(theme_list, {
    initialValue: colorMode,
  })
  const isDark = computed(() => colorMode.value === 'dark')

  watch(
    () => colorMode.value,
    (val) => {
      ElMessage.info('主题切换为:' + theme_map[val] + '主题')
      if (val === 'dark') {
        appStore.setIsDark(true)
      } else {
        appStore.setIsDark(false)
      }
    }
  )

  return {
    isDark,
    colorMode,
    nextColor,
  }
}
